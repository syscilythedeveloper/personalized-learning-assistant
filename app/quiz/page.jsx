"use client";
import { quiz } from "../data.js";
import Navbar from "../components/Navbar.jsx";
import LoadingSpinner from '../components/LoadingSpinner'; 
import React, { useState } from 'react';

const Page = () => {
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [checked, setChecked] = useState(false);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState({ score: 0, correctAnswers: 0, wrongAnswers: 0 });
    const [aiRecommendation, setAIRecommendation] = useState("");
    const [loading, setLoading] = useState(false);

    const { questions } = quiz;
    const { question, answers, correctAnswer } = questions[activeQuestion];

    const onAnswerSelected = (answer, idx) => {
        setChecked(true);
        setSelectedAnswerIndex(idx);
        setSelectedAnswer(answer === correctAnswer);
    };

    const nextQuestion = () => {
        setResult((prev) => 
            selectedAnswer ? 
            { ...prev, score: prev.score + 1, correctAnswers: prev.correctAnswers + 1 } : 
            { ...prev, wrongAnswers: prev.wrongAnswers + 1 }
        );

        if (activeQuestion < questions.length - 1) {
            setActiveQuestion(prev => prev + 1);
        } else {
            setShowResult(true);
            getAIRecommendation(questions, result);
        }
        setChecked(false);
        setSelectedAnswerIndex(null);
    };

    const getAIRecommendation = async (questions, result) => {
        const questionsForAi = questions.map((q) => ({
            question: q.question,
            userAnswer: q.userAnswer,
            correctAnswer: q.correctAnswer,
            isCorrect: q.userAnswer === q.correctAnswer,
        }));

        setLoading(true);
        try {
            const response = await fetch('/api/ai-recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questions: questionsForAi,
                    totalQuestions: questions.length,
                    correctAnswers: result.correctAnswers,
                    wrongAnswers: result.wrongAnswers,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const aiRecommendation = await response.json();
            setAIRecommendation(aiRecommendation.suggestion || "No suggestion available");
        } catch (error) {
            console.error('Error:', error);
            setAIRecommendation("Error getting AI recommendation");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container"> 
                <h1>Quiz Page</h1>
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
                            <button 
                                onClick={nextQuestion} 
                                className="quiz-button" 
                                disabled={!checked}
                            >
                                {activeQuestion === questions.length - 1 ? "Finish" : "Next"}
                            </button>
                        </div>
                    ) : (
                        <div className="quiz-container">
                            <h3>Results</h3>
                            <h3>Overall: {((result.score / questions.length) * 100).toFixed(2)}%</h3>
                            <p>Total Questions: <span>{questions.length}</span></p>
                            <p>Results: <span>{result.score}</span></p>
                            <p>Correct Answers: <span>{result.correctAnswers}</span></p>
                            <p>Wrong Answers: <span>{result.wrongAnswers}</span></p>
                            <p>Study Recommendation: 
                                {loading ? <LoadingSpinner /> : <span>{aiRecommendation}</span>}
                            </p>
                            <button className="quiz-button" onClick={() => window.location.reload()}>Restart</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Page;
