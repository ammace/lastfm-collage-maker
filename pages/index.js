import Picker from "@/components/picker";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { Roboto } from "next/font/google";

const font = Roboto({
  weight: "500",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();
  const userInput = useRef();

  const types = ["phone", "square", "standard", "hd", "cinema", "screen"];
  const typeOptions = [
    { name: "Phone", index: 0 },
    { name: "Square", index: 1 },
    { name: "Standard", index: 2 },
    { name: "Wide", index: 3 },
    { name: "Cinema", index: 4 },
    { name: "Your Screen", index: 5 },
  ];
  const [typeIndex, setTypeIndex] = useState();

  const periods = ["7day", "1month", "3month", "6month", "12month", "overall"];
  const periodOptions = [
    { name: "One Week", index: 0 },
    { name: "One Month", index: 1 },
    { name: "Three Months", index: 2 },
    { name: "Six Months", index: 3 },
    { name: "One Year", index: 4 },
    { name: "All Time", index: 5 },
  ];
  const [periodIndex, setPeriodIndex] = useState();

  return (
    <>
      <Head>
        <title>Collager</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={"main " + font.className}>
        <input
          type="text"
          className={"button " + font.className}
          placeholder="User"
          ref={userInput}
        ></input>
        <Picker
          options={typeOptions}
          option={typeIndex !== undefined ? typeOptions[typeIndex].name : ""}
          placeholder="Aspect Ratio"
          setOption={setTypeIndex}
        />
        <Picker
          options={periodOptions}
          option={
            periodIndex !== undefined ? periodOptions[periodIndex].name : ""
          }
          placeholder="Period"
          setOption={setPeriodIndex}
        />
        <a
          onClick={() => {
            if (!userInput.current.value === undefined) return;
            if (periodIndex === undefined) return;
            if (typeIndex === undefined) return;

            router.replace(
              "/collage?" +
                new URLSearchParams({
                  user: userInput.current.value,
                  period: periods[periodIndex],
                  type: types[typeIndex],
                }).toString()
            );
          }}
        >
          Submit
        </a>
      </div>
    </>
  );
}
