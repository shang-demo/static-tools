define([

  'underscore'
  ,'backbone'

  ,'src/constants'

], function (

  _
  ,Backbone

  ,constant

) {

  return Backbone.View.extend({

    FPS_RANGE:
        constant.MAXIMUM_CSS_OUTPUT_FPS - constant.MINIMUM_CSS_OUTPUT_FPS

    /**
     * @param {Stylie} stylie
     */
    ,initialize: function (opts) {
      this.stylie = opts.stylie;

      this.$el.dragonSlider({
        drag: _.bind(this.onSliderDrag, this)
      });

      var val =
          (constant.DEFAULT_CSS_OUTPUT_FPS - constant.MINIMUM_CSS_OUTPUT_FPS)
              / (this.FPS_RANGE - 1);

      this.$el.dragonSliderSet(val, false);
    }

    ,onSliderDrag: function (val) {
      this.stylie.trigger(constant.UPDATE_CSS_OUTPUT);
    }

    ,getFPS: function () {
      var sliderVal = this.$el.dragonSliderGet();
      return constant.MINIMUM_CSS_OUTPUT_FPS
             + (sliderVal * this.FPS_RANGE);
    }
  });

});
