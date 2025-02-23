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
      selectedAttributes: props.selectedAttributes || {}, 
    };
  }

  componentDidMount() {
    if (Object.keys(this.state.selectedAttributes).length === 0) {
      const defaultAttributes: SelectedAttributesType = {};

      this.props.attributes.forEach((attribute) => {
        if (attribute.values?.length) {
          defaultAttributes[attribute.name] = {
            id: attribute.id,
            value: attribute.values[0].value,
          };
        }
      });

      this.setState({ selectedAttributes: defaultAttributes });

      if (this.props.onSelect) {
        Object.entries(defaultAttributes).forEach(([name, { id, value }]) => {
          this.props.onSelect?.(id, name, value);
        });
      }
    }
  }

  componentDidUpdate(prevProps: AttributePropsType) {
    const prevSelected = prevProps.selectedAttributes || {};
    const currentSelected = this.props.selectedAttributes || {};

    if (JSON.stringify(prevSelected) !== JSON.stringify(currentSelected)) {
      this.setState({ selectedAttributes: currentSelected });
    }
  }

  handleSelect = (attributeId: number, name: string, value: string) => {
    const updatedAttributes = {
      ...this.state.selectedAttributes,
      [name]: { id: attributeId, value },
    };

    this.setState({ selectedAttributes: updatedAttributes });

    if (this.props.onSelect) {
      this.props.onSelect(attributeId, name, value);
    }
  };

  render() {
    return (
      <>
        {this.props.attributes.map((attribute) => {
          const kebabCaseAttributeName = attribute.name.replace(/\s+/g, '-').toLowerCase();

          return (
            <div
              key={attribute.id}
              className={`attribute--wrapper ${this.props.isSmall ? "sm" : ""}`}
              data-testid={`cart-item-attribute-${kebabCaseAttributeName}`}
            >
              <div className="attribute--name">{attribute.name}:</div>
              <div className="attribute--value_wrapper">
                {attribute.values?.map((value) => {
                  const kebabCaseValue = value.value.replace(/\s+/g, '-').toLowerCase();
                  const isSelected = this.state.selectedAttributes[attribute.name]?.value === value.value;

                  return (
                    <div
                      key={value.value}
                      className={`${attribute.type === "swatch" ? "attribute--swatch_value" : "attribute--text_value"} ${isSelected ? "active" : ""}`}
                      onClick={() => this.props.isSmall ? {} : this.handleSelect(Number(attribute.id), attribute.name, value.value)}
                      data-testid={`cart-item-attribute-${kebabCaseAttributeName}-${kebabCaseValue}${isSelected ? "-selected" : ""}`}
                    >
                      {attribute.type === 'swatch' && (<div style={{background: value.value}}/>) }
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
