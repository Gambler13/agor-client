<template>
  <div>
    <div class="dashboard">
      Player ID: {{gameStats.PlayerId}}
      <br>
      Mass: {{gameStats.Mass}}
      <br>
      Food Eaten: {{gameStats.FoodEaten}}
      <br>
      Players: {{gameStats.NumPlayers}}
      <br>
    </div>
    <div>
      <canvas
        id="canvas"
        class="canvas"
        width="800"
        height="600"
        v-on:mousemove="updateCoordinates"
      ></canvas>
    </div>
  </div>
</template>

<script>
const lut = require("../assets/lut.json");

export default {
  data() {
    return {
      message: "",
      vueCanvas: null,
      canvasRect: null,
      gameStats: { PlayerId: 0, Mass: 0, FoodEaten: 0 },
      coordinates: { x: 0.0, y: 0.0 },
      dX: 0,
      dY: 0,
      entities: [],
      imgPattern: null
    };
  },
  mounted() {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    this.vueCanvas = ctx;
    const pattern = this.createPattern()
    this.imgPattern = ctx.createPattern(pattern, "repeat");
  },
  created() {
    this.interval = setInterval(() => this.drawEntities(), 30);
  },
  methods: {
    emitEvent() {
      var coords = new Float32Array(2);
      coords[0] = this.coordinates.x;
      coords[1] = this.coordinates.y;

      if (
        Number.isNaN(this.coordinates.x) ||
        Number.isNaN(this.coordinates.y)
      ) {
        return;
      }

      this.$socket.client.emit("position", new Buffer(coords.buffer));
    },
    updateCoordinates: function(event) {
      // pass event object, bound to mouse move with updat

      this.canvasRect = document
        .getElementById("canvas")
        .getBoundingClientRect();
      console.log(JSON.stringify(this.canvasRect));

      this.coordinates.x =
        event.clientX - this.canvasRect.left - this.canvasRect.width / 2;
      this.coordinates.y =
        event.clientY - this.canvasRect.top - this.canvasRect.height / 2;
      this.throttle(this.emitEvent(), 100);
    },
    throttle(func, wait) {
      var timeout;
      return function() {
        var context = this,
          args = arguments;
        if (!timeout) {
          // the first time the event fires, we setup a timer, which
          // is used as a guard to block subsequent calls; once the
          // timer's handler fires, we reset it and create a new one
          timeout = setTimeout(function() {
            timeout = null;
            func.apply(context, args);
          }, wait);
        }
      };
    },
    drawEntities() {
      this.vueCanvas.clearRect(0, 0, 800, 600);

      this.vueCanvas.save();
      this.vueCanvas.scale(2, 2);
      this.vueCanvas.translate(this.dX, this.dY);
      //this.vueCanvas.fillStyle = "#FFFFFF";
      this.vueCanvas.fillStyle = this.imgPattern;
      this.vueCanvas.rect(0, 0, 1200, 900);
      this.vueCanvas.fill();
      this.vueCanvas.stroke();

      for (let e of this.entities) {
        this.vueCanvas.beginPath();
        this.vueCanvas.arc(e.X, e.Y, e.Radius, 0, 2 * Math.PI);
        //this.vueCanvas.fillStyle = e.Color;
        if (e.Color < lut.length) {
          this.vueCanvas.fillStyle = lut[e.Color];
        } else {
          this.vueCanvas.fillStyle = "#FF00BB";
        }
        this.vueCanvas.fill();
      }
      this.vueCanvas.restore();
    },
    createPattern() {
      var pattern = document.createElement("canvas");
      pattern.width = 40;
      pattern.height = 40;
      var pctx = pattern.getContext("2d");

      pctx.beginPath();
      pctx.rect(0, 0, 100, 100);
      pctx.lineWidth = 8;
      pctx.strokeStyle = "rgb(156, 156, 156)";
      pctx.lineJoin = "miter";
      pctx.miterLimit = 4.0;
      pctx.stroke();

      return pattern;
    }
  },
  sockets: {
    update: function(c, ents, stats) {
      let center = JSON.parse(c);

      var dataLen = 17;
      var nData = ents.byteLength / dataLen;
      var view1 = new DataView(ents);

      this.entities = [];

      for (var i = 0; i < nData; i++) {
        let eX = view1.getUint32(0 + i * dataLen);
        let eY = view1.getUint32(4 + i * dataLen);
        let rad = view1.getFloat64(8 + i * dataLen);
        let colIndex = view1.getUint8(16 + i * dataLen);

        let ent = {
          X: eX,
          Y: eY,
          Radius: rad,
          Color: colIndex
        };
        this.entities.push(ent);
      }

      this.dX = -center.X + 800.0 / 4.0;
      this.dY = -center.Y + 600.0 / 4.0;

      this.gameStats = JSON.parse(stats);
    }
  }
};
</script>


<style scoped>
.canvas {
  background: azure;
  border: 1px solid whitesmoke;
}

.dashboard {
  margin: 16px;
  font-size: 1.2em;
}
</style>
