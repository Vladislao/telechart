const compileShader = (gl, shaderSource, shaderType) => {
  var shader = gl.createShader(shaderType);

  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    throw "could not compile shader:" + gl.getShaderInfoLog(shader);
  }

  return shader;
};

const createProgram = (gl, source) => {
  const vertexShader = compileShader(
    gl,
    source.VSHADER_SOURCE,
    gl.VERTEX_SHADER
  );
  const fragmentShader = compileShader(
    gl,
    source.FSHADER_SOURCE,
    gl.FRAGMENT_SHADER
  );

  var program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    throw "program filed to link:" + gl.getProgramInfoLog(program);
  }

  const uniforms = getParameterLocations(gl, program, gl.ACTIVE_UNIFORMS);
  const attributes = getParameterLocations(gl, program, gl.ACTIVE_ATTRIBUTES);

  return { program, uniforms, attributes };
};

const renameParameter = name => {
  if (name.substr(-3) === "[0]") {
    return name.substr(0, name.length - 3);
  }
  return name;
};

const getActiveParameter = (gl, program, pname, i) => {
  if (pname === gl.ACTIVE_ATTRIBUTES) return gl.getActiveAttrib(program, i);
  return gl.getActiveUniform(program, i);
};

const getParameterLocation = (gl, program, pname, name) => {
  if (pname === gl.ACTIVE_ATTRIBUTES)
    return gl.getAttribLocation(program, name);
  return gl.getUniformLocation(program, name);
};

const getParameterLocations = (gl, program, pname) => {
  const locations = {};
  const num = gl.getProgramParameter(program, pname);

  for (let i = 0; i < num; ++i) {
    const info = getActiveParameter(gl, program, pname, i);
    if (!info) {
      break;
    }
    // ???
    // const index = gl.getAttribLocation(program, info.name);
    locations[renameParameter(info.name)] = getParameterLocation(
      gl,
      program,
      pname,
      info.name
    );
  }

  return locations;
};

const createAttributeInfo = (gl, data, usage, size, type) => {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, usage || gl.STATIC_DRAW);
  return {
    buffer,
    size: size || 1,
    type: type || gl.FLOAT,
    stride: 0,
    offset: 0
  };
};

const setUniforms = (gl, locations, uniforms) => {
  Object.keys(locations).forEach(v => {
    const info = uniforms[v]();
    const location = locations[v];
    gl[`uniform${info[0]}`].apply(gl, [location].concat(info[1]));
  });
};

const setAttributes = (gl, locations, attributes) => {
  Object.keys(locations).forEach(v => {
    const info = attributes[v];
    const location = locations[v];

    gl.bindBuffer(gl.ARRAY_BUFFER, info.buffer);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(
      location,
      info.size,
      info.type,
      false,
      info.stride,
      info.offset
    );
  });
};

module.exports.compileShader = compileShader;
module.exports.createProgram = createProgram;

module.exports.createAttributeInfo = createAttributeInfo;
module.exports.setUniforms = setUniforms;
module.exports.setAttributes = setAttributes;
