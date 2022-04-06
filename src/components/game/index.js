import { useEffect, useRef, useState } from "react"
import {
  ARROW_LEFT_CODE,
  ARROW_RIGHT_CODE,
  BALL_SIZE,
  BLOCK_H,
  BLOCK_OFFSET,
  BLOCK_W,
  COORDINATE_Y,
  PLATFORM_SPEED,
  PLATFORM_WIDTH,
  SCENE_WIDTH
} from "../../const";
import { background, ball, block, platform } from "../../img";

const Game = () => {
  const canvasRef = useRef();
  const [ctx, setCtx] = useState(null);
  const [imagesList, setImagesList] = useState({});

  const getBallInfo = () => {
    const ballX = (SCENE_WIDTH - BALL_SIZE) / 2;
    const ballY = COORDINATE_Y - BALL_SIZE;
    const info = [0, 0, BALL_SIZE, BALL_SIZE, ballX, ballY, BALL_SIZE, BALL_SIZE]
    return info;
  }

  const getPlatformCoordinates = () => {
    const x = (SCENE_WIDTH - PLATFORM_WIDTH) / 2;
    const coords = [x, COORDINATE_Y];
    return coords;
  }

  const getBlocks = (image = '', rows = 4, cols = 8) => {
    const startX = (SCENE_WIDTH - (BLOCK_W * cols + BLOCK_OFFSET * (cols - 1))) / 2;
    const blocksList = [];
    for(let row = 0; row < rows; row++) {
      for(let col = 0; col < cols; col++) {
        const x = (BLOCK_W + BLOCK_OFFSET) * col + startX;
        const y = 60 + (BLOCK_H + BLOCK_OFFSET) * row;
        blocksList.push([image, x, y])
      }
    }
    return blocksList;
  }

  const setImages = () => {
    const ballImg = new Image();
    const blockImg = new Image();
    const bgr = new Image();
    const platformImg = new Image();

    ballImg.src = ball;
    blockImg.src = block;
    bgr.src = background;
    platformImg.src = platform;

    const ballInfo = getBallInfo();
    const platformCoords = getPlatformCoordinates();
    const blocks = getBlocks(blockImg);

    const images = {
      background: [bgr, 0, 0],
      ball: [ballImg, ...ballInfo],
      blocks: [...blocks],
      platform: [platformImg, ...platformCoords]
    }
    setImagesList(images);
  }

  const movePlatform = (event) => {
    const { code } = event;
    const list = {...imagesList};
    if(imagesList.platform) {
      let platformX = imagesList.platform[1];
      if(code === ARROW_RIGHT_CODE) {
        const maxX = SCENE_WIDTH - PLATFORM_WIDTH;
        list.platform[1] = platformX < maxX ? platformX + PLATFORM_SPEED : maxX;
      }
      if(code === ARROW_LEFT_CODE) {
        list.platform[1] = platformX > 0 ? platformX - PLATFORM_SPEED : 0;
      }
      setImagesList(list);
    }
  }

  const initGame = () => {
    const context = canvasRef?.current.getContext("2d");
    setCtx(context);
    setImages();
  }

  const drawImages = () => {
    window.requestAnimationFrame(() => {
      if(ctx && Object.keys(imagesList).length) {
        Object.keys(imagesList).map(key => {
          const info = imagesList[key]
          if(key === "blocks") {
            info.forEach(el => ctx.drawImage(...el))
          } else {
            ctx.drawImage(...info);
          }
        })
      }
    });
  }

  useEffect(() => {
    initGame();
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', movePlatform)
  }, [ctx])

  useEffect(() => {
    drawImages();
  }, [imagesList])

  return (
    <canvas id="scene" ref={canvasRef} width={640} height={360} />
  )
}

export default Game