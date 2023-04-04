import Head from "next/head";
import { useEffect, useRef } from "react";
import { loadImage } from "canvas";
import { useRouter } from "next/router";

function calculate(aspectRatio) {
  var closest = {
    albums: null,
    start: null,
    end: null,
    height: null,
    ratio: Infinity,
  };

  for (let end = 1; end <= 100; end++) {
    for (let start = 1; start <= end; start++) {
      var height = 0;
      var albums = 0;

      for (let index = start; index <= end; index++) {
        albums += index;
        height += start / index;
      }

      if (albums <= aspectRatio || albums > 100) {
        continue;
      }

      const ratio = start / height;
      if (
        Math.abs(aspectRatio - ratio) < Math.abs(aspectRatio - closest.ratio)
      ) {
        closest = { albums, start, end, height, ratio };
      }
    }
  }

  return closest;
}

async function create(canvas, aspectRatio, period, user) {
  const blueprint = calculate(aspectRatio);

  if (!blueprint.albums) return;
  if (period === undefined) period = "overall";
  if (user === undefined) user = "danchovikk";

  fetch(
    "http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&api_key=df0373523543e987dd095adaa12ea8e6&format=json&" +
      new URLSearchParams({ limit: blueprint.albums, period, user }).toString()
  )
    .then((response) => response.json())
    .then(async (body) => {
      const albums = body.topalbums.album.map(
        (value) => value.image[3]["#text"]
      );

      console.log(
        new URLSearchParams({
          limit: blueprint.albums,
          period,
          user,
        }).toString()
      );

      const albumImageSize = 300;

      canvas.width = albumImageSize * blueprint.start;
      canvas.height = albumImageSize * blueprint.height;
      const ctx = canvas.getContext("2d");

      var index = 0;
      var height = 0;
      for (
        let albumsInRow = blueprint.start;
        albumsInRow <= blueprint.end;
        albumsInRow++
      ) {
        const size = Math.ceil(
          (blueprint.start * albumImageSize) / albumsInRow
        );

        for (let album = 0; album < albumsInRow; album++) {
          const image = await loadImage(albums[index]);
          ctx.drawImage(image, album * size, height, size, size);
          index++;
        }
        height += size;
      }
    });
}

export default function Home() {
  const router = useRouter();
  const canvas = useRef();

  useEffect(() => {
    const { type, user, period } = router.query;

    var aspectRatio;
    switch (type) {
      case "phone":
        aspectRatio = 9 / 16;
        break;
      case "square":
        aspectRatio = 1;
        break;
      case "standard":
        aspectRatio = 4 / 3;
        break;
      case "hd":
        aspectRatio = 16 / 9;
        break;
      case "cinema":
        aspectRatio = 2;
        break;
      case "screen":
        aspectRatio = screen.width / screen.height;
        break;
      default:
        aspectRatio = screen.width / screen.height;
        break;
    }
    create(canvas.current, aspectRatio, period, user);
  }, [router]);

  return (
    <>
      <Head>
        <title>Collage</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <canvas ref={canvas}></canvas>
    </>
  );
}
