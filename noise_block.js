//block definition
//noise block
var number_x;
var number_y;
var final_calc;
var temp_noise = [];
var values = [];
var counter;
var length;
var dropdown_switch;

Blockly.Blocks['noise'] = {
  init: function() {
      this.appendValueInput("noise")
          .appendField("noise")
          .appendField(new Blockly.FieldDropdown([["seed1","seed1"], ["seed2","seed2"]]), "seed");
          this.setInputsInline(false);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(210);
       this.setTooltip("");
       this.setHelpUrl("")
    }
};

Blockly.Blocks['fbm'] = {
  init: function() {
    this.appendValueInput("fbm")
        .appendField("fbm")
        .appendField(new Blockly.FieldNumber(50), "x")
        .appendField(new Blockly.FieldNumber(50), "y");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

function random1 (x, y) {
  var dot;
  dot = x * 12.9898 + y * 78.233;
  dot = Math.sin(dot);
  dot = dot * 43758.5453123
  dot = dot - Math.floor(dot);
  return dot;
}

function random2 (x, y) {
  var dot;
  dot = x * 21.9898 + y * 78.233;
  dot = Math.sin(dot);
  dot = dot * 43758.5453123
  dot = dot - Math.floor(dot);
  return dot;
}

function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}

function noise (x, y, seed) {
    var i_x, i_y;
    i_x = Math.floor(x);
    i_y = Math.floor(y);
    var f_x, f_y;
    f_x = x - i_x;
    f_y = y - i_y;

    // Four corners in 2D of a tile
    var a, b, c, d;
    if (seed === 1) {
    a = random1(i_x, i_y);
    b = random1(i_x + 1.0, i_y);
    c = random1(i_x, i_y + 1.0);
    d = random1(i_x + 1.0, i_y + 1.0);
  }
   if (seed === 2) {
     a = random2(i_x, i_y);
     b = random2(i_x + 1.0, i_y);
     c = random2(i_x, i_y + 1.0);
     d = random2(i_x + 1.0, i_y + 1.0);
   }
    var u_x, u_y;
    u_x = f_x * f_x * (3.0 - 2.0 * f_x);
    u_y = f_y * f_y * (3.0 - 2.0 * f_y);

    return lerp(a, b, u_x) +
            (c - a)* u_y * (1.0 - u_x) +
            (d - b) * u_x * u_y;
}

function fbm (x, y, seed) {
    // Initial values
    var value = 0.0;
    var amplitude = .5;
    var frequency = 0.;

    // Loop of octaves
    var i;
    for (i = 0; i < 6; i++) {
        value = value + amplitude * noise(x,y, seed);
        x = x * 2;
        y = y * 2;
        amplitude = amplitude * .5;
    }
    return value;
}

Blockly.JavaScript['noise'] = function(block) {
  dropdown_switch = block.getFieldValue('seed');
  var i, j;
  var imgData = [];
  temp_noise = [];
  for (i = 0.0; i < 1.0; i = i + (1.0 / 500.)) {
    for (j = 0; j <1.0; j= j + (1.0 / 500.)) {
      if (dropdown_switch==="seed1") {
            final_calc = noise(i * 3, j * 3, 1);
      } else if (dropdown_switch==="seed2") {
            final_calc = noise(i * 3, j * 3, 2);
      }
    temp_noise.push(final_calc);
    temp_noise.push(final_calc);
    temp_noise.push(final_calc);
    temp_noise.push(255);
  }
}

  var code = "var c = document.getElementById('myCanvas'); \
    var ctx = c.getContext('2d'); \
    var imgData = ctx.createImageData(500, 500); \
    var i; \
    for (i = 0; i < imgData.data.length; i += 4) { \
      imgData.data[i+0] = temp_noise[i] * 255; \
      imgData.data[i+1] = temp_noise[i] * 255; \
      imgData.data[i+2] = temp_noise[i] * 255; \
      imgData.data[i+3] = 255; \
    } \
    ctx.putImageData(imgData, 0, 0);";
  return code;
};

Blockly.JavaScript['fbm'] = function(block) {
  var number_x = block.getFieldValue('x');
  var number_y = block.getFieldValue('y');
  var value_fbm = Blockly.JavaScript.valueToCode(block, 'fbm', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var i,j;
  var imgData = [];
  values = [];
  for (i = 0.0; i < 1.0; i = i + (1.0 / 500.)) {
    for (j = 0; j <1.0; j= j + (1.0 / 500.)) {
      if (dropdown_switch==="seed1") {
            final_calc = fbm(i * 3, j * 3, 1);
      } else if (dropdown_switch==="seed2") {
            final_calc = fbm(i * 3, j * 3, 2);
      }
    values.push(final_calc);
    values.push(final_calc);
    values.push(final_calc);
    values.push(255);
  }
}

  var code = "for (i = 0; i < imgData.data.length; i += 4) { \
      imgData.data[i+0] = values[i] * 255; \
      imgData.data[i+1] = values[i] * 255; \
      imgData.data[i+2] = values[i] * 255; \
      imgData.data[i+3] = 255; \
    } \
    console.log(values.length); \
    ctx.putImageData(imgData, 0, 0);";
  // TODO: Change ORDER_NONE to the correct strength.
  return code;
};
