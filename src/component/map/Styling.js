import { Fill, Stroke, Style } from "ol/style";

export const defaultStyling = new Style({
  fill: new Fill({
    color: [250, 250, 250, 1]
  }),
  stroke: new Stroke({
    color: [220, 220, 220, 1],
    width: 1
  })
});

export const highlightStyleFn = function(feature, resolution) {
  return new Style({
    fill: new Fill({
      color: [200, 20, 20, 1]
    }),
    stroke: new Stroke({
      color: [20, 200, 20, 1],
      width: 1
    })
  });
};
