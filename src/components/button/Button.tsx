import { Component } from "react";
import { ButtonPropsType } from "../../types/propType";

class Button extends Component<ButtonPropsType> {
    static defaultProps = {
        width: "292px",
        height: "52px",
        padding: "16px 32px",
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "19.2px",
        backgroundColor: "#5ECE7B",
        textColor: "#fff",
        border: "none",
        borderRadius: "5px",
        position: "static",
        boxShadow: "none",
        visibility: "visible",
        transition: "none",
        hoverEffect: false,
        iconPosition: "left",
        circular: false,
        marginTop: "15px",
        cursor: "pointer",
        dataTestId: ''
    };

    render() {
        const {
            label,
            icon,
            onClick,
            width,
            height,
            padding,
            fontSize,
            fontWeight,
            lineHeight,
            backgroundColor,
            textColor,
            border,
            borderRadius,
            position,
            top,
            left,
            boxShadow,
            visibility,
            transition,
            hoverEffect,
            iconPosition,
            circular,
            marginTop,
            cursor,
            margin,
            dataTestId
        } = this.props;

        const buttonStyles = {
            width: circular ? "50px" : width,
            height: circular ? "50px" : height,
            padding: circular ? "0px" : padding,
            fontSize,
            fontWeight,
            lineHeight,
            backgroundColor,
            color: textColor,
            border,
            borderRadius: circular ? "50%" : borderRadius,
            position,
            top,
            left,
            boxShadow,
            visibility,
            transition,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor,
            margin,
            gap: label && icon ? "8px" : "0px",
            marginTop,

        };

        return (
            <button
                data-testid={dataTestId}
                onClick={onClick}
                className={`custom-button ${hoverEffect ? "hover-effect" : ""}`}
                style={buttonStyles}
            >
                {icon && iconPosition === "left" && <span>{icon}</span>}
                {!circular && label && <span>{label}</span>}
                {icon && iconPosition === "right" && <span>{icon}</span>}
            </button>
        );
    }
}

export default Button;
