import React, { Component, createRef, forwardRef } from "react";
import "./Slider.css";

interface SliderProps {
  images: string[];
  isHorizontal: boolean;
  onImageClick: (index: number) => void; 
  activeImageIndex: number;
}

interface SliderState {
  activeIndex: number;
}

class SliderClass extends Component<SliderProps, SliderState> {
  private sliderRef = createRef<HTMLDivElement>();
  private imageRefs: React.RefObject<HTMLDivElement>[];

  constructor(props: SliderProps) {
    super(props);
    this.state = { activeIndex: this.props.activeImageIndex };

    // ✅ Ensure type safety for refs
    this.imageRefs = props.images.map(() => createRef<HTMLDivElement>());
  }

  componentDidUpdate(_: SliderProps, prevState: SliderState) {
    if (prevState.activeIndex !== this.state.activeIndex) {
      this.scrollToActiveImage();
    }
  }

  scrollToActiveImage = () => {
    const activeImageRef = this.imageRefs[this.state.activeIndex].current;
    const slider = this.sliderRef.current;

    if (activeImageRef && slider) {
      activeImageRef.scrollIntoView({
        behavior: "smooth",
        block: this.props.isHorizontal ? "nearest" : "center",
        inline: this.props.isHorizontal ? "center" : "nearest",
      });
    }
  };

  // ✅ Expose methods for parent component (ProductDetails)
  scrollToNext = () => {
    this.setState((prevState) => ({
      activeIndex: prevState.activeIndex === this.props.images.length - 1 ? 0 : prevState.activeIndex + 1,
    }));
  };

  scrollToPrev = () => {
    this.setState((prevState) => ({
      activeIndex: prevState.activeIndex === 0 ? this.props.images.length - 1 : prevState.activeIndex - 1,
    }));
  };

  

  render() {
    const { images, isHorizontal } = this.props;
    let { activeIndex } = this.state;

    return (
      <div data-testid='product-gallery' className={`slider-container ${isHorizontal ? "horizontal" : "vertical"}`} ref={this.sliderRef}>
        {images.map((img, index) => (
          <div
            key={index}
            ref={this.imageRefs[index]}
            className={`slide ${this.props.activeImageIndex === index ? "active" : ""}`}
            onClick={() => { this.props.onImageClick(index) }}
          >
            <img src={img} alt={`Slide ${index}`} />
          </div>
        ))}
      </div>
    );
  }
}

// ✅ Wrap class component with forwardRef
const Slider = forwardRef((props: SliderProps, ref) => {
  const sliderInstance = createRef<SliderClass>();

  React.useImperativeHandle(ref, () => ({
    scrollToNext: () => sliderInstance.current?.scrollToNext(),
    scrollToPrev: () => sliderInstance.current?.scrollToPrev(),
  }));

  return <SliderClass ref={sliderInstance} {...props} />;
});

export default Slider;
