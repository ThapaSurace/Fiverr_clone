import React from "react";
import Slider from "infinite-react-carousel";
import './Style.css'

const Sliderr = ({ children, slidesToShow, arrowsScroll, duration }) => {
  return (
    <Slider slidesToShow={slidesToShow} arrowsScroll={arrowsScroll} duration={duration}>
      {children}
    </Slider>
  );
};

export default Sliderr;
