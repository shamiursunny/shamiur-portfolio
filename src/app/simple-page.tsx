export default function SimplePage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-4xl mx-auto text-center p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Shamiur Rashid Sunny
                </h1>
                <h2 className="text-2xl text-gray-600 mb-8">
                    Full Stack Developer & DevSecOps Engineer
                </h2>
                <p className="text-lg text-gray-700 mb-8">
                    Welcome to my professional portfolio. I'm a full-stack developer with expertise in modern web technologies and security practices.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Web Development</h3>
                        <p className="text-gray-600">React, Next.js, TypeScript, Node.js</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">DevSecOps</h3>
                        <p className="text-gray-600">Security best practices, CI/CD, Cloud</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">AI Integration</h3>
                        <p className="text-gray-600">Chatbots, Machine Learning, Automation</p>
                    </div>
                </div>
                <div className="mt-12">
                    <a
                        href="https://github.com/shamiursunny"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        View My GitHub
                    </a>
                </div>
            </div>
        </div>
    )
}
