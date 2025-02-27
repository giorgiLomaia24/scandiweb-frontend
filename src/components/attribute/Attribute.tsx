import { Component } from "react";
import "./attribute.css";
import { SelectedAttributesType } from "../../types/cartType";
import { AttributePropsType } from "../../types/propType";
import { getSizeAbbreviation } from "../../utils/helperFunctions";

interface AttributeState {
  selectedAttributes: SelectedAttributesType;
}

export class Attribute extends Component<AttributePropsType, AttributeState> {
  constructor(props: AttributePropsType) {
    super(props);

    this.state = {
      selectedAttributes: props.isSmall
        ? props.selectedAttributes || {} // ✅ Use pre-selected attributes inside Cart
        : props.isPDP
        ? {} // ✅ Start empty on PDP (User must select)
        : this.getDefaultAttributes(), // ✅ Auto-select on Home
    };
  }

  componentDidMount() {
    if (!this.props.isPDP && !this.props.isSmall && Object.keys(this.state.selectedAttributes).length === 0) {
      const defaultAttributes = this.getDefaultAttributes();
      this.setState({ selectedAttributes: defaultAttributes });

      if (this.props.onSelect) {
        Object.entries(defaultAttributes).forEach(([name, { id, value }]) => {
          this.props.onSelect?.(id, name, value);
        });
      }
    }
  }

  getDefaultAttributes = (): SelectedAttributesType => {
    const defaultAttributes: SelectedAttributesType = {};
    this.props.attributes.forEach((attribute) => {
      if (attribute.values?.length) {
        defaultAttributes[attribute.name] = {
          id: attribute.id,
          value: attribute.values[0].value,
        };
      }
    });
    return defaultAttributes;
  };

  handleSelect = (attributeId: number, attributeName: string, value: string) => {
    if (this.props.isSmall) return; // ❌ Prevent changing attributes inside Cart

    this.setState(
      (prevState) => ({
        selectedAttributes: {
          ...prevState.selectedAttributes,
          [attributeName]: { id: attributeId, value },
        },
      }),
      () => {
        console.log("✅ Updated Attributes:", this.state.selectedAttributes);
        if (this.props.onSelect) {
          this.props.onSelect(attributeId, attributeName, value);
        }
      }
    );
  };

  render() {
    return (
      <>
        {this.props.attributes.map((attribute) => {
          const kebabCaseAttributeName = attribute.name.replace(/\s+/g, "-").toLowerCase();

          // ✅ Ensure correct `data-testid` for PDP vs Cart
          const containerDataTestId = this.props.isSmall
            ? `cart-item-attribute-${kebabCaseAttributeName}`
            : `product-attribute-${kebabCaseAttributeName}`;

          return (
            <div key={attribute.id} className={`attribute--wrapper ${this.props.isSmall ? "sm" : ""}`} data-testid={containerDataTestId}>
              <div className="attribute--name">{attribute.name}:</div>
              <div className="attribute--value_wrapper">
                {attribute.values?.map((value) => {
                  const formattedValue = value.value.startsWith("#")
                    ? value.value.toUpperCase() // ✅ Convert hex values to uppercase (Fix Auto QA issue)
                    : value.value.replace(/\s+/g, "-"); // ✅ Keep original casing for non-hex values

                  // ✅ Ensure correct selection handling
                  const isSelected = this.props.isSmall
                    ? this.props.selectedAttributes?.[attribute.name]?.value === value.value // ✅ Always use `props` in Cart
                    : this.state.selectedAttributes[attribute.name]?.value === value.value;  // ✅ Use state in PDP

                  // ✅ Ensure correct `data-testid` format
                  const optionDataTestId = this.props.isSmall
                    ? `cart-item-attribute-${kebabCaseAttributeName}-${formattedValue}${isSelected ? "-selected" : ""}`
                    : `product-attribute-${kebabCaseAttributeName}-${formattedValue}${isSelected ? "-selected" : ""}`;

                  return (
                    <div
                      key={value.value}
                      className={`${attribute.type === "swatch" ? "attribute--swatch_value" : "attribute--text_value"} ${
                        isSelected ? "active" : ""
                      }`}
                      onClick={() => {
                        if (!this.props.isSmall) {
                          this.handleSelect(Number(attribute.id), attribute.name, value.value);
                        }
                      }}
                      data-testid={optionDataTestId}
                    >
                      {attribute.type === "swatch" && <div style={{ background: value.value }} />}
                      {attribute.type === "text" ? getSizeAbbreviation(value.display_value) : ""}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </>
    );
  }
}

export default Attribute;
