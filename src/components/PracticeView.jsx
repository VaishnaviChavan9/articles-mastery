
import { useState } from 'react'

function PracticeView({ questions, onBack, onComplete, subtopicId }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [score, setScore] = useState(0)
    const [finished, setFinished] = useState(false)

    const currentQuestion = questions[currentIndex]
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer

    function handleNext() {
        if (currentIndex === questions.length - 1) {
            const result = {
                subtopicId: subtopicId,
                totalQuestions: questions.length,
                score: score,
                completedAt: new Date().toISOString()
            }

            localStorage.setItem(
                'articlesMasteryProgress',
                JSON.stringify(result)
            )

            onComplete(result)
            setFinished(true)

            setFinished(true)
        } else {
            setCurrentIndex(currentIndex + 1)
            setSelectedAnswer(null)
        }
    }

    if (finished) {
        return (
            <div className="card p-4 text-center">
                <h2 className="fw-bold">Practice Completed!</h2>
                <h3 className="text-primary my-3">
                    Your score: {score} / {questions.length}
                </h3>
                <button className="btn btn-primary" onClick={onBack}>
                    Back to Lesson
                </button>
            </div>
        )
    }

    return (
        <div>
            <button className="btn btn-outline-secondary mb-4" onClick={onBack}>
                ← Back to Lesson
            </button>

            <div className="d-flex justify-content-between mb-3">
                <span className="fw-semibold">Practice</span>
                <span className="text-secondary">
                    Question {currentIndex + 1} of {questions.length}
                </span>
            </div>

            <div className="progress mb-4" style={{ height: '8px' }}>
                <div
                    className="progress-bar"
                    style={{
                        width: `${((currentIndex + 1) / questions.length) * 100}%`
                    }}
                />
            </div>

            <div className="card module-card">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-4">
                        {currentQuestion.question}
                    </h5>

                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            className={`btn w-100 text-start mb-2 ${selectedAnswer === option
                                ? 'btn-primary'
                                : 'btn-outline-secondary'
                                }`}
                            disabled={selectedAnswer !== null}
                            onClick={() => {
                                setSelectedAnswer(option)
                                if (option === currentQuestion.correctAnswer) {
                                    setScore(previous => previous + 1)
                                }
                            }}
                        >
                            {option}
                        </button>
                    ))}

                    {selectedAnswer !== null && (
                        <div className={`alert mt-3 ${isCorrect ? 'alert-success' : 'alert-danger'
                            }`}>
                            <strong>
                                {isCorrect ? 'Correct!' : 'Incorrect!'}
                            </strong>
                            <p className="mb-0 mt-1">
                                {currentQuestion.explanation}
                            </p>
                        </div>
                    )}

                    <button
                        className="btn btn-primary mt-3"
                        disabled={selectedAnswer === null}
                        onClick={handleNext}
                    >
                        {currentIndex === questions.length - 1
                            ? 'Finish Practice'
                            : 'Next Question'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PracticeView
