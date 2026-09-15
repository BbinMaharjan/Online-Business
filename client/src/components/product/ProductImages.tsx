import { Carousel, CarouselItem, CarouselCaption } from "react-responsive-carousel";
import { Box, CssBaseline } from "@mui/material";
import { useState } from "react";
import Image from "next/image";

const ProductImages = ({ images }: { images: string[] }) => {
  const [mainImageIndex, setMainImageIndex] = useState(0);

  return (
    <CssBaseline />
    <Box sx={{ width: "100%", height: 400, borderRadius: 2, overflow: "hidden", marginBottom: 3 }}>
      <Carousel
        autoPlay
        timeout={5000}
        showArrows
        showIndicators
        index={mainImageIndex}
        onIndexChange={setMainImageIndex}
      >
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <Image
              src={image}
              alt={`Product image ${index + 1}`}
              fill
              placeholder="blur"
              loading="lazy"
            />
          </CarouselItem>
        ))}
      </Carousel>
    </Box>
  );
};

export default ProductImages;