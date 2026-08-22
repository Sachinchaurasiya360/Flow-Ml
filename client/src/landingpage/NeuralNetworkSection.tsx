import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

const LAYERS = [
  { neurons: 3, label: "Input" },
  { neurons: 5, label: "Hidden 1" },
  { neurons: 4, label: "Hidden 2" },
  { neurons: 2, label: "Output" },
];

const LAYER_SPACING = 120;
const NEURON_RADIUS = 14;
const CANVAS_HEIGHT = 280;

const getNeuronY = (index: number, count: number): number => {
  const totalHeight = (count - 1) * 52;
  const startY = (CANVAS_HEIGHT - totalHeight) / 2;
  return startY + index * 52;
};

const NeuralNetworkSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  const totalWidth =
    (LAYERS.length - 1) * LAYER_SPACING + NEURON_RADIUS * 2 + 80;

  return (
    <section className="py-32 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-600 mb-4">
              Under the hood
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-100 tracking-tight leading-tight mb-6">
              Neural networks,
              <br />
              made visible.
            </h2>
            <p className="text-base text-neutral-500 leading-relaxed mb-8">
              Configure layers, set activation functions, and watch forward
              propagation happen in real time. Each neuron shows its activation
              value. Each connection shows its weight.
            </p>
            <div className="space-y-3">
              {[
                "Configure layers and neurons with sliders",
                "Choose activation functions per layer",
                "Watch activations propagate forward",
                "Inspect weights and gradients",
              ].map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                  <p className="text-sm text-neutral-400">{point}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — network viz */}
          <div ref={ref} className="flex justify-center lg:justify-end">
            <div className="bg-neutral-900 border border-white/[0.06] rounded-xl p-8 overflow-x-auto">
              <svg
                width={totalWidth}
                height={CANVAS_HEIGHT}
                viewBox={`0 0 ${totalWidth} ${CANVAS_HEIGHT}`}
              >
                {/* Connections */}
                {LAYERS.slice(0, -1).map((layer, li) => {
                  const nextLayer = LAYERS[li + 1];
                  return layer.neurons > 0
                    ? Array.from({ length: layer.neurons }).map((_, ni) =>
                        Array.from({ length: nextLayer.neurons }).map(
                          (_, nj) => {
                            const x1 = 40 + li * LAYER_SPACING + NEURON_RADIUS;
                            const y1 = getNeuronY(ni, layer.neurons);
                            const x2 =
                              40 + (li + 1) * LAYER_SPACING - NEURON_RADIUS;
                            const y2 = getNeuronY(nj, nextLayer.neurons);
                            return (
                              <motion.line
                                key={`${li}-${ni}-${nj}`}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="#1f2937"
                                strokeWidth="1"
                                initial={{ opacity: 0 }}
                                animate={
                                  isInView
                                    ? {
                                        opacity: 1,
                                        stroke: [
                                          "#1f2937",
                                          "#4338ca",
                                          "#1f2937",
                                        ],
                                      }
                                    : { opacity: 0 }
                                }
                                transition={{
                                  duration: 2,
                                  delay:
                                    li * 0.3 +
                                    (ni * nextLayer.neurons + nj) * 0.04,
                                  repeat: Infinity,
                                  repeatDelay: 2,
                                }}
                              />
                            );
                          },
                        )
                      )
                    : null;
                })}

                {/* Neurons */}
                {LAYERS.map((layer, li) =>
                  Array.from({ length: layer.neurons }).map((_, ni) => {
                    const cx = 40 + li * LAYER_SPACING;
                    const cy = getNeuronY(ni, layer.neurons);
                    const delay = li * 0.15 + ni * 0.08;

                    return (
                      <motion.g key={`${li}-${ni}`}>
                        <motion.circle
                          cx={cx}
                          cy={cy}
                          r={NEURON_RADIUS}
                          fill="#0d0d0d"
                          stroke="#374151"
                          strokeWidth="1.5"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={
                            isInView ? { opacity: 1, scale: 1 } : undefined
                          }
                          transition={{
                            duration: 0.4,
                            delay,
                            type: "spring",
                            stiffness: 200,
                          }}
                        />
                        <motion.circle
                          cx={cx}
                          cy={cy}
                          r={NEURON_RADIUS - 4}
                          fill="transparent"
                          stroke="#6366f1"
                          strokeWidth="1"
                          initial={{ opacity: 0 }}
                          animate={
                            isInView
                              ? {
                                  opacity: [0, 0.6, 0],
                                  r: [NEURON_RADIUS - 4, NEURON_RADIUS - 2],
                                }
                              : undefined
                          }
                          transition={{
                            duration: 1.5,
                            delay: delay + 0.5,
                            repeat: Infinity,
                            repeatDelay: 1.5,
                          }}
                        />
                      </motion.g>
                    );
                  }),
                )}

                {/* Layer labels */}
                {LAYERS.map((layer, li) => (
                  <motion.text
                    key={`label-${li}`}
                    x={40 + li * LAYER_SPACING}
                    y={CANVAS_HEIGHT - 8}
                    textAnchor="middle"
                    fill="#4b5563"
                    fontSize="9"
                    fontFamily="Inter, sans-serif"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : undefined}
                    transition={{ duration: 0.4, delay: li * 0.15 + 0.3 }}
                  >
                    {layer.label}
                  </motion.text>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeuralNetworkSection;
