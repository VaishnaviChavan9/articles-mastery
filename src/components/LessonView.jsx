
function LessonView({ lesson, onBack, onStartPractice }) {
    
    if (!lesson) {
        return <p>Lesson not found.</p>
    }

    return (
        <div>
            <button
                className="btn btn-outline-secondary mb-4"
                onClick={onBack}
            >
                ← Back to subtopics
            </button>

            <div className="mb-4">
                <span className="badge text-bg-primary mb-2">
                    LESSON
                </span>

                <h2 className="fw-bold">{lesson.title}</h2>

                <p className="text-secondary">
                    {lesson.description}
                </p>
            </div>

            {lesson.sections.map((section, index) => (
                <div className="card module-card mb-3" key={index}>
                    <div className="card-body p-4">

                        <h5 className="fw-bold mb-3">
                            {section.heading}
                        </h5>

                        <p>{section.content}</p>

                        {section.rules?.map((rule, ruleIndex) => (
                            <div className="bg-light rounded p-3 mb-3" key={ruleIndex}>
                                <h6 className="fw-bold">{rule.name}</h6>
                                <p className="mb-2">{rule.description}</p>
                                <small className="text-secondary">
                                    Example: {rule.example}
                                </small>
                            </div>
                        ))}

                        {section.examples?.map((example, exampleIndex) => (
                            <div className="border-start border-primary border-3 ps-3 mb-3"
                                key={exampleIndex}>

                                <h6 className="fw-bold mb-1">
                                    {example.sentence}
                                </h6>

                                <p className="text-secondary small mb-0">
                                    {example.explanation}
                                </p>
                            </div>
                        ))}

                    </div>
                </div>
            ))}

            <div className="text-center mt-4">
                <button
                    className="btn btn-primary px-4"
                    onClick={onStartPractice}
                >
                    Start Practice
                </button>
            </div>
        </div>
    )
}

export default LessonView
