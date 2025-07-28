"use client"
import React from "react"


const HowItWorks = () => {

    const jobSeekerSteps = [
        { number: 1, title: "Browse Jobs", description: "Discover openings tailored to your skills." },
        { number: 2, title: "Apply Easily", description: "Submit applications directly and quickly." },
        { number: 3, title: "Get Hired", description: "Connect with companies and land your dream job." }
    ];

    const employerSteps = [
        { number: 1, title: "Post Job", description: "Publish detailed listings to attract talent." },
        { number: 2, title: "Review Applicants", description: "Manage and screen applications efficiently." },
        { number: 3, title: "Hire Talent", description: "Shortlist and recruit the best candidates." }
    ];


    return (
        <section className="hero w-full px-4 mb-10">
            <div className="container mx-auto px-4 py-8 mb-10">
            <h2 className="text-4xl font-bold my-8">How It Works</h2>

            {/* Main container for the two large cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-full mx-auto"> {/* Increased max-w for more space */}

                {/* Card for Job Seekers */}
                <div className="card bg-base-200 border-2 border-info  p-6 flex flex-col items-center">
                    <h2 className="text-3xl font-bold text-info mb-8 text-center">For Job Seekers</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"> {/* Responsive grid for steps */}
                        {jobSeekerSteps.map((step) => (
                            <div key={step.number} className="flex flex-col items-center text-center p-4">
                                {/* Simple rounded circle for number */}
                                <div className="w-10 h-10 rounded-full bg-info text-info-content flex items-center justify-center font-bold text-lg mb-3">
                                    {step.number}
                                </div>
                                <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                                <p className="text-sm text-base-content/80">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Card for Employers */}
                <div className="card bg-base-200 border-2 border-accent  p-6 flex flex-col items-center">
                    <h2 className="text-3xl font-bold text-accent mb-8 text-center">For Employers</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"> {/* Responsive grid for steps */}
                        {employerSteps.map((step) => (
                            <div key={step.number} className="flex flex-col items-center text-center p-4">
                                {/* Simple rounded circle for number */}
                                <div className="w-10 h-10 rounded-full bg-accent text-info-content flex items-center justify-center font-bold text-lg mb-3">
                                    {step.number}
                                </div>
                                <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                                <p className="text-sm text-base-content/80">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
        </section>
    )
}

export default HowItWorks;