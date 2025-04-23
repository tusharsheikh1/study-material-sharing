import React, { useEffect } from 'react';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import devAnimation from '../assets/lottie/dev-animation.json';

const DeveloperProfile = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white min-h-screen pb-32">
      {/* HERO */}
      <motion.section
        className="flex flex-col items-center justify-center text-center py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={fadeIn}
      >
        <div className="relative w-48 h-48 mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 animate-spin-slow blur-md opacity-30" />
          <img
            src="https://scontent.fdac2-1.fna.fbcdn.net/v/t39.30808-1/415535995_337021575790306_1033942528636397166_n.jpg?stp=c0.8.746.746a_dst-jpg_s200x200_tt6&_nc_cat=110&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeF7hI12_GQcXZAn78M2tEHQQQc4umvpQaBBBzi6a-lBoKsDMV4nuG1T5sRpgfijJnDGqV1Nt2rj83IIwlGAc5a5&_nc_ohc=rlGFpIyMFXMQ7kNvwF64R_u&_nc_oc=AdmGNeIXZ8oxNPzJJ_tfnHx04jARWl8rcKQfnT3aAJli50PaR5xEtssTgz8O4c79cSU_QWpeVZ9l_epTHeJRnLBg&_nc_zt=24&_nc_ht=scontent.fdac2-1.fna&_nc_gid=iOTuWYSYqgmFARpiRmWDHQ&oh=00_AfHcnd2fwegkEmCV5xmQDow5eMXwavLc7jNU0RFmeQDoDA&oe=680E784B"
            alt="Tushar Sheikh"
            className="relative w-48 h-48 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-2xl"
          />
        </div>
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
          Tushar Sheikh
        </h1>
        <p className="text-indigo-600 dark:text-indigo-400 font-medium mt-2 text-lg tracking-wide">
          Hobbyist Full Stack Developer
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm font-medium">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white rounded-full">
            📍 Dhaka, Bangladesh
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-white rounded-full">
            🌐 tusharsheikh.dev
          </span>
        </div>
      </motion.section>

      {/* ABOUT */}
      <motion.section
        className="max-w-4xl mx-auto px-6 mt-10 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={fadeIn}
      >
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
          👋 About Me
        </h2>
        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          I'm a self-taught developer who codes for fun. I enjoy exploring full stack technologies
          and love building personal projects that help me learn and grow. From playful UI designs
          to experimenting with backend logic — this is my creative space, not a profession.
        </p>
      </motion.section>

      {/* JUST FOR FUN */}
      <motion.section
        className="max-w-4xl mx-auto px-6 mt-16 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={fadeIn}
      >
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-rose-500 bg-clip-text text-transparent">
          🎮 This Is Just For Fun 😄
        </h2>
        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          I'm not here to land jobs or freelance gigs — I build things just because I enjoy the
          process. Debugging? Like solving puzzles. Styling UIs? Like painting a canvas. Hosting
          side projects? Just like sharing toys! It’s my weekend playground where code meets
          creativity ✨.
        </p>
      </motion.section>

      {/* LOTTIE */}
      <motion.section
        className="max-w-4xl mx-auto mt-16 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={fadeIn}
      >
        <div className="relative p-4 rounded-2xl">
          <div className="absolute -inset-1 bg-gradient-to-tr from-purple-400 to-blue-400 blur-xl opacity-20 rounded-3xl"></div>
          <Lottie animationData={devAnimation} loop className="relative w-full h-72" />
        </div>
      </motion.section>

      {/* CODE SNIPPETS */}
      <motion.section
        className="max-w-5xl mx-auto mt-20 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={fadeIn}
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
          💻 Floating Code Snippets
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'React State',
              code: `const [count, setCount] = useState(0);\n\n<button onClick={() => setCount(count + 1)}>+</button>`,
            },
            {
              title: 'Express Route',
              code: `app.get('/api', (req, res) => {\n  res.send('Hello World');\n});`,
            },
            {
              title: 'Tailwind Button',
              code: `<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">\n  Click me\n</button>`,
            },
          ].map((snippet, i) => (
            <div
              key={i}
              className="rounded-xl p-4 backdrop-blur-xl bg-white/30 dark:bg-white/10 border border-white/20 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="font-semibold mb-2 text-lg">{snippet.title}</h3>
              <pre className="text-sm text-left whitespace-pre-wrap font-mono text-gray-800 dark:text-gray-200 overflow-auto">
                <code>{snippet.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </motion.section>

      {/* SKILLS */}
      <motion.section
        className="max-w-5xl mx-auto mt-20 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={fadeIn}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-indigo-600">
          🧠 My Tech Stack
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
          {[
            'React.js',
            'Next.js',
            'Node.js',
            'Express.js',
            'MongoDB',
            'Tailwind CSS',
            'TypeScript',
            'JavaScript',
            'Firebase',
            'REST API',
            'Git/GitHub',
            'Figma',
          ].map((tech, i) => (
            <span
              key={i}
              className="backdrop-blur-xl bg-white/30 dark:bg-white/10 border border-white/20 px-4 py-2 text-center rounded-xl hover:scale-105 transition-transform text-gray-900 dark:text-white shadow"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.section>

      {/* SOCIAL */}
      <motion.section
        className="mt-20 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={fadeIn}
      >
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-pink-500">
          🔗 Connect With Me
        </h2>
        <div className="flex justify-center gap-6 text-3xl">
          {[
            {
              icon: 'fab fa-github',
              url: 'https://github.com/tusharsheikh1',
              color: 'text-gray-800',
            },
            {
              icon: 'fab fa-linkedin',
              url: 'https://www.linkedin.com/in/tushar-mktjnu/',
              color: 'text-blue-600',
            },
            {
              icon: 'fas fa-envelope',
              url: 'mailto:tushar.mkt15@gmail.com',
              color: 'text-red-600',
            },
            {
              icon: 'fab fa-twitter',
              url: 'https://twitter.com/',
              color: 'text-sky-500',
            },
            {
              icon: 'fab fa-facebook',
              url: 'https://facebook.com/tusharmktjnu',
              color: 'text-blue-700',
            },
          ].map(({ icon, url, color }, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noreferrer"
              title={icon.split(' ')[1].replace('fa-', '').toUpperCase()}
              className={`hover:scale-125 transition-transform ${color}`}
            >
              <i className={icon}></i>
            </a>
          ))}
        </div>
      </motion.section>

      {/* CONTACT */}
      <motion.div
        className="fixed bottom-6 left-0 right-0 flex justify-center animate-fade-in"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={fadeIn}
      >
        <a
          href="mailto:tushar.mkt15@gmail.com"
          className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-purple-600 hover:to-fuchsia-500 text-white font-semibold rounded-full shadow-xl transition"
        >
          📩 Say Hello
        </a>
      </motion.div>
    </div>
  );
};

export default DeveloperProfile;
