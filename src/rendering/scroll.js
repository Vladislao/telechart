const drawTrack = (context, x, width, height, radius, dir) => {
  context.beginPath();

  context.moveTo(x - width + radius * dir, 0);
  context.arcTo(x - width, 0, x - width, radius, radius);
  context.lineTo(x - width, height - radius);
  context.arcTo(x - width, height, x - width + radius * dir, height, radius);
  context.lineTo(x, height);
  context.lineTo(x, 0);

  // const clipWidth = Math.floor(width * 0.3);
  // const clipRaduis = Math.floor(clipWidth / 2);

  // const clipHeight = Math.floor(height * 0.3);
  // const clipX = Math.floor(width / 2 + clipWidth / 2);
  // const clipY = Math.floor(height / 2 - clipHeight / 2 + clipRaduis);

  // context.moveTo(clipX, clipY);
  // context.arcTo(
  //   width / 2,
  //   clipY - clipRaduis,
  //   clipX - clipWidth,
  //   clipY,
  //   clipRaduis
  // );
  // context.lineTo(clipX - clipWidth, clipY + clipHeight - clipRaduis);
  // context.arcTo(
  //   width / 2,
  //   clipY + clipHeight,
  //   clipX,
  //   clipY + clipHeight - clipRaduis,
  //   clipRaduis
  // );
  // context.closePath();

  context.fill();
};

// const mask = (context, options) => {
//   context.fillRect(
//     0,
//     tcache.padding,
//     tcache.left,
//     canvas.height - tcache.padding * 2
//   );
//   if (right !== canvas.width) {
//     context.fillRect(
//       right,
//       tcache.padding,
//       canvas.width - right,
//       canvas.height - tcache.padding * 2
//     );
//   }

// }

module.exports.drawTrack = drawTrack;
