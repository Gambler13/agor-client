<template>
  <div class="hello">
    <input type="text" v-model="message">
    Coordinates: {{coordinates.x}} / {{coordinates.y}}
    Player ID: {{gameStats.PlayerId}} <br>
    Mass: {{gameStats.Mass}} <br>
    Food Eaten: {{gameStats.FoodEaten}} <br>
Players: {{gameStats.NumPlayers}} <br>
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
export default {
  data() {
    return {
      message: "",
      vueCanvas: null,
      canvasRect: null,
      gameStats: {PlayerId: 0, Mass: 0, FoodEaten: 0},
      coordinates: { x: 0.0, y: 0.0 }
    };
  },
  mounted() {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    this.vueCanvas = ctx;
  },
  methods: {
    emitEvent() {
      this.$socket.emit("position", JSON.stringify(this.coordinates));
    },
    updateCoordinates: function(event) {
      // pass event object, bound to mouse move with updat

      this.canvasRect = document
        .getElementById("canvas")
        .getBoundingClientRect();
      console.log(JSON.stringify(this.canvasRect));

      this.coordinates.x =
        (event.clientX - this.canvasRect.left - this.canvasRect.width / 2);
      this.coordinates.y =
        (event.clientY - this.canvasRect.top - this.canvasRect.height / 2);
      this.throttle(this.emitEvent(), 100);
    },
    drawRect() {
      // clear canvas
      this.vueCanvas.clearRect(0, 0, 800, 600);

      // draw rect
      this.vueCanvas.beginPath();
      this.vueCanvas.rect(0, 0, 200, 100);
      this.vueCanvas.stroke();
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
    }
  },
  sockets: {
    update: function(data) {
      //console.log(JSON.stringify(data))
       this.vueCanvas.clearRect(0, 0, 800, 600);
      let center = JSON.parse(data[0])
      let entities = JSON.parse(data[1])
        
                let dX = -center.X + 800.0/2.0
                let dY = -center.Y + 600.0/2.0
      
              this.vueCanvas.save() 
        this.vueCanvas.translate(dX, dY);
        this.vueCanvas.fillStyle = "#FFFFFF"
        this.vueCanvas.rect(0,0,1200,900)
        this.vueCanvas.fill();
        this.vueCanvas.stroke();
        this.vueCanvas.restore() 
      
      for (let e of entities){
        this.vueCanvas.save() 
        this.vueCanvas.beginPath();
        this.vueCanvas.translate(dX, dY);
        this.vueCanvas.arc(e.X, e.Y, e.Radius, 0, 2 * Math.PI);
        this.vueCanvas.fillStyle = e.Color
        this.vueCanvas.fill();
        this.vueCanvas.restore() 
      }

this.gameStats = JSON.parse(data[2])

    }
  }
};
</script>


<style scoped>
.canvas {
  background: azure;
}
</style>
