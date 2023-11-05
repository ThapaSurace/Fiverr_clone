import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";

import React from "react";

const RatingStar = () => {
  return (
    <>
      <Stack spacing={1}>
        <Rating name="half-rating" defaultValue={0} precision={0.5} />
      </Stack>
    </>
  );
};

export default RatingStar;
