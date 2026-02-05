'use client';

import * as React from 'react';
import Image from 'next/image';
import useEmblaCarousel, { type EmblaCarouselType } from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { placeHolderImages } from '@/lib/placeholder-images';

export default function BannerSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const sliderImages = [
    placeHolderImages.find(p => p.id === 'tractor_1'),
    placeHolderImages.find(p => p.id === 'tempo_1'),
    placeHolderImages.find(p => p.id === 'jcb_1'),
  ].filter(Boolean);

  const scrollTo = React.useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = React. useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);


  return (
    <div className="relative">
        <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
            {sliderImages.map((img, index) => (
            <div className="relative flex-[0_0_100%] h-36" key={index}>
                {img && <Image
                src={img.imageUrl}
                alt={img.description}
                fill
                className="object-cover"
                data-ai-hint={img.imageHint}
                priority={index === 0}
                />}
            </div>
            ))}
        </div>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {scrollSnaps.map((_, index) => (
                <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                        index === selectedIndex ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
    </div>
  );
}
