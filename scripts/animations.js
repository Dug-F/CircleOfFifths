gsap.registerEffect({
  name: "swapText",
  effect: (targets, config) => {
    let tl = gsap.timeline({ delay: config.delay });
    tl.to(targets, { opacity: 0, duration: config.duration / 2 });
    tl.add(() => (targets[0].innerText = config.text));
    tl.to(targets, { opacity: 1, duration: config.duration });
    return tl;
  },
  defaults: { duration: 1 },
  extendTimeline: true,
});
