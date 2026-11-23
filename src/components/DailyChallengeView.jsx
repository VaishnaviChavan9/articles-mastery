
import { useState } from 'react'

function DailyChallengeView({ questions, onBack, bestScore, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [score, setScore] = useState(0)
    const [finished, setFinished] = useState(false)

    const currentQuestion = questions[currentIndex]
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer

    const updatedBestScore = Math.max(bestScore, score)

    function handleAnswer(option) {
        setSelectedAnswer(option)

        if (option === currentQuestion.correctAnswer) {
            setScore(previous => previous + 1)
        }
    }

    function handleNext() {
        if (currentIndex === questions.length - 1) {
            onComplete(score)
            setFinished(true)
        } else {
            setCurrentIndex(previous => previous + 1)
            setSelectedAnswer(null)
        }
    }

    if (finished) {
        return (
            <div className="card p-4 text-center">
                <h2 className="fw-bold">Daily Challenge Completed!</h2>

                <h3 className="text-primary my-3">
                    Your score: {score} / {questions.length}
                </h3>

                {score > bestScore ? (
                    <p className="text-success fw-semibold">
                        🎉 New personal best!
                    </p>
                ) : (
                    <p className="text-secondary">
                        Keep practising to beat your personal best.
                    </p>
                )}

                <div className="bg-light rounded p-3 my-3">
                    <small className="text-secondary">YOUR HIGHEST SCORE</small>
                    <h3 className="fw-bold text-success mb-0">
                        {updatedBestScore} / {questions.length}
                    </h3>
                </div>

                <p className="text-secondary">
                    Come back tomorrow for a fresh set of questions.
                </p>

                <button className="btn btn-primary" onClick={onBack}>
                    Back to Dashboard
                </button>
            </div>
        )
    }

    return (
        <div>
            <button className="btn btn-outline-secondary mb-4" onClick={onBack}>
                ← Back to Dashboard
            </button>

            <div className="mb-3">
                <span className="badge text-bg-primary mb-2">
                    DAILY CHALLENGE
                </span>

                <h2 className="fw-bold">Test your knowledge</h2>

                <p className="text-secondary">
                    Questions from all six learning modules.
                </p>

                <p className="fw-semibold text-success">
                    Your highest score: {bestScore} / {questions.length}
                </p>
            </div>

            <div className="d-flex justify-content-between mb-3">
                <span className="fw-semibold">Daily Practice</span>

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
                    <small className="text-secondary">
                        {currentQuestion.moduleTitle} · {currentQuestion.subtopicTitle}
                    </small>

                    <h5 className="fw-bold my-4">
                        {currentQuestion.question}
                    </h5>

                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            className={`btn w-100 text-start mb-2 ${
                                selectedAnswer === option
                                    ? 'btn-primary'
                                    : 'btn-outline-secondary'
                            }`}
                            disabled={selectedAnswer !== null}
                            onClick={() => handleAnswer(option)}
                        >
                            {option}
                        </button>
                    ))}

                    {selectedAnswer !== null && (
                        <div className={`alert mt-3 ${
                            isCorrect ? 'alert-success' : 'alert-danger'
                        }`}>
                            <strong>
                                {isCorrect ? 'Correct!' : 'Incorrect!'}
                            </strong>

                            <p className="mb-0 mt-1">
                                {currentQuestion.explanation}
                            </p>

                            {!isCorrect && (
                                <div className="mt-2">
                                    {currentQuestion.chapterUnlocked ? (
                                        <>
                                            <strong>Recommended revision:</strong>
                                            <p className="mb-0">
                                                Revisit "{currentQuestion.subtopicTitle}"
                                                in {currentQuestion.moduleTitle}.
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <strong>Chapter not unlocked yet.</strong>
                                            <p className="mb-0">
                                                This question belongs to {currentQuestion.moduleTitle}.
                                                Complete the earlier chapters and learn this
                                                module to understand this topic.
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        className="btn btn-primary mt-3"
                        disabled={selectedAnswer === null}
                        onClick={handleNext}
                    >
                        {currentIndex === questions.length - 1
                            ? 'Finish Challenge'
                            : 'Next Question'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DailyChallengeView
