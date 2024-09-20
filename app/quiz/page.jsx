"use client"
import {quiz} from "../data.js"
import Navbar from "../components/Navbar.jsx"
import React, {useState} from 'react'



const page = () => {
    const [activeQuestion, setActiveQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState("")
    const [checked, setChecked] = useState(false)
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null)
    const [showResult, setShowResult] = useState(false)
    const [result, setResult] = useState({
        score: 0, 
        correctAnswers: 0, 
        wrongAnswers: 0,
    })
    const [incorrectAnswers, setIncorrectAnswers] = useState([])

    const {questions} = quiz;

    // Ensure questions[activeQuestion] exists
    if (!questions || !questions[activeQuestion]) {
        return <div>No questions available or invalid question index.</div>;
    }

    const {question, answers, correctAnswer, standard} = questions[activeQuestion];
    
    const onAnswerSelected = (answer, idx) => {
        setChecked(true)
        setSelectedAnswerIndex(idx)
        if (answer === correctAnswer) {
            setSelectedAnswer(true)
            console.log("true")
        } else {
            setSelectedAnswer(false)
            console.log("false")
            setIncorrectAnswers(prev => [...prev, {
                question: question,
                questionId: activeQuestion,
                userAnswer: answer,
                correctAnswer: correctAnswer
            }])
        }
    }

    const getAIRecommendation = async (questions, result) => {
        const questionsForAi = questions.map((q, index) => ({
            question: q.question,
            userAnswer: q.userAnswer,
            correctAnswer: q.correctAnswer,
            isCorrect: q.userAnswer === q.correctAnswer
        }));

        try {
            const response = await fetch('/api/ai-recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    questions: questionsForAi,
                    totalQuestions: questions.length,
                    correctAnswers: result.correctAnswers,
                    wrongAnswers: result.wrongAnswers
                }),
            });

            if (!response.ok) {
                console.log(console.log("OpenAI API Key:", process.env.OPENAI_API_KEY))
                throw new Error('Network response was not ok');
            }

            const aiRecommendation = await response.json();
            console.log("AI suggestion is: ", aiRecommendation.suggestion)
            console.log("Questions for AI: ", questionsForAi)
            return aiRecommendation.suggestion || "No suggestion available";
        } catch (error) {
            console.error('Error:', error);
            return "Error getting AI recommendation";
        }
    }

    const nextQuestion = () => {
        setSelectedAnswerIndex(null)
        setResult((prev) =>
            selectedAnswer ?
                { ...prev, score: prev.score + 1, correctAnswers: prev.correctAnswers + 1 } :
                { ...prev, wrongAnswers: prev.wrongAnswers + 1 }
        )

        if (activeQuestion !== questions.length - 1) {
            setActiveQuestion((prev) => prev + 1)
        } else {
            setActiveQuestion(0)
            setShowResult(true)
            console.log(incorrectAnswers)
            getAIRecommendation(incorrectAnswers, result)
        }
        setChecked(false)
    }

    return (
        <>
            <Navbar />
            <div className="container">
                <h1> Quiz Page</h1>
                <div>
                    <h2>
                        Question: {activeQuestion + 1}
                        <span> / {questions.length}</span>
                    </h2>
                </div>
                <div>
                    {!showResult ? (
                        <div className="quiz-container">
                            <h3>{question}</h3>
                            {answers.map((answer, idx) => (
                                <li key={idx}
                                    onClick={() => onAnswerSelected(answer, idx)}
                                    className={selectedAnswerIndex === idx ? 'li-selected' : 'li-hover'}>
                                    <span>{answer}</span>
                                </li>
                            ))}
                            {checked ?
                                <button onClick={nextQuestion} className="quiz-button">
                                    {activeQuestion === questions.length - 1 ? "Finish" : "Next"}
                                </button> :
                                <button onClick={nextQuestion} disabled className="quiz-button btn-disabled">
                                    {" "}
                                    {activeQuestion === questions.length - 1 ? "Finish" : "Next"}
                                </button>}
                        </div>
                    ) : (
                        <div className="quiz-container">
                            <h3>Results</h3>
                            <h3> Overall {(result.score / questions.length) * 100}%</h3>
                            <p>Total Questions: <span> {questions.length}</span></p>
                            <p>Results: <span> {result.score}</span></p>
                            <p>Correct Answers: <span> {result.correctAnswers}</span></p>
                            <p>Wrong Answers: <span> {result.wrongAnswers}</span></p>
                            <button className="quiz-button" onClick={() => window.location.reload()}> Restart </button>
                        </div>)}
                </div>
            </div>
        </>
    )
}

export default page;
