import LessonsCards from "../components/lessonsCards/lessonsCards";

export default function Home() {
  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(to left bottom, #fffcf3, #fffaeb, #fff8e4, #fff6dc, #fff4d5)",
        minHeight: "calc(100vh - 82px)",
      }}
      className=" container pt-10 px-20"
    >
      <LessonsCards />
    </div>
  );
}
