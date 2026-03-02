"use client";

import { memo, useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

/**
 * Particles are purely client-side. The engine init runs once;
 * options are memoized to avoid re-creating the particle system on every render.
 * `fullScreen: false` keeps particles scoped to the absolute container.
 * Wrapped in memo so typing in the form doesn't remount the particle system.
 */
const ParticlesBackground = memo(function ParticlesBackground({ theme }) {
    const [engineReady, setEngineReady] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadFull(engine);
        }).then(() => setEngineReady(true));
    }, []); // runs once — engine is a singleton

    const options = useMemo(() => {
        const color = theme === "dark" ? "#ffffff" : "#000000";
        return {
            fullScreen: false,
            particles: {
                number: { value: 50, density: { enable: true, value_area: 800 } },
                color: { value: color },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color,
                    opacity: 0.4,
                    width: 1,
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                },
            },
            interactivity: {
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                },
                modes: {
                    repulse: { distance: 100, duration: 0.4 },
                    push: { particles_nb: 4 },
                },
            },
            retina_detect: true,
        };
    }, [theme]); // only re-create when theme changes

    if (!engineReady) return null;

    return (
        <Particles
            id="particles-js"
            className="absolute inset-0 z-0"
            options={options}
        />
    );
});

export default ParticlesBackground;
