import React from "react";
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import "./HealthCare Feature.css";

const byPrefixAndName = { fas, far };

export default function HealthCareFeature() {
  const baseCards = [
    {
      title: "Easy Appointment Booking",
      icon: byPrefixAndName.fas.faCalendarCheck,
    },
    {
      title: "Verified Specialists",
      icon: byPrefixAndName.fas.faUserDoctor,
    },
    {
      title: "Secure Digital Records",
      icon: byPrefixAndName.fas.faFileShield,
    },
    {
      title: "24/7 Support",
      icon: byPrefixAndName.fas.faHeadset,
    },
    {
      title: "Online Video Consultation",
      icon: byPrefixAndName.far.faVideo,
    },
    {
      title: "Family Care Support",
      icon: byPrefixAndName.fas.faHandsHoldingChild,
    },
    {
      title: "Compassionate Care Experience",
      icon: byPrefixAndName.fas.faHandHoldingHeart,
    },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const autoplay = useRef(
    Autoplay({
      delay: 1000,
    }),
  ); 

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      watchDrag: false,
    },
    [autoplay.current],
  );

  const next = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const prev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="healthcare-feature">
      <Container className="healthcare-feature-slider">
        <div className="slider">
          <div className="viewport" ref={emblaRef}>
            <div className="cards-wrapper">
              {baseCards.map((card, i) => (
                <div className="slide" key={i}>
                  <div
                    className={`card ${
                      i === selectedIndex
                        ? "active-card"
                        : Math.abs(i - selectedIndex) === 1
                          ? "middle-card"
                          : "back-card"
                    }`}
                  >
                    <div className="icon">
                      <FontAwesomeIcon
                        icon={card.icon}
                        // className="feature-icon"
                      />
                    </div>

                    <p className="title">{card.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="slider-dots">
          {baseCards.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === selectedIndex ? "active-dot" : ""}`}
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
