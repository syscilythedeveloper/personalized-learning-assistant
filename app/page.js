import Link from "next/link";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <main>
        <Navbar />
        <div className="container">
          <h1>Quiz App</h1>
          <Link href="/quiz">
            <button className="quiz-button"> Start Quiz</button>
          </Link>
        </div>
      </main>
    </>
  );
}
