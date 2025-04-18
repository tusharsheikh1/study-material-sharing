import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";

const TestimonialCard = ({ message, name, role, batch, accentColor, photo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700 backdrop-blur-lg rounded-3xl px-6 py-8 h-[430px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-xl hover:shadow-blue-200 dark:hover:shadow-indigo-800 transition-all flex flex-col justify-between text-center"
    >
      <div className="absolute top-5 left-5 text-4xl text-blue-100 dark:text-indigo-200 opacity-30 z-0">
        <FaQuoteLeft />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-28 h-28 rounded-full border-4 border-transparent bg-gradient-to-tr from-blue-400 to-indigo-500 p-[3px] mb-4">
          <img
            src={photo}
            alt={name}
            className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800"
          />
        </div>

        <p className="text-gray-800 dark:text-gray-100 italic text-sm sm:text-base leading-relaxed max-w-xs">
          “{message}”
        </p>
      </div>

      <div className="z-10 mt-4">
        <h4 className={`font-semibold text-lg ${accentColor}`}>{name}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{role}, {batch}</p>
      </div>
    </motion.div>
  );
};

const Testimonial = () => {
  const testimonials = [
    {
      name: "Riyad Hossain",
      role: "Student",
      batch: "Batch 15",
      accentColor: "text-blue-600",
      photo: "https://scontent.fzyl2-2.fna.fbcdn.net/v/t39.30808-6/476444263_1108593530951331_1926946524540850593_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeH-ycRzhkCj2CdftGcNHOZ2P_8H3FsH8Us__wfcWwfxS6RI49mG_5jwcBN37vFJoEzEehZEYyC72TD7ubaWLAcZ&_nc_ohc=w0Jit_7usQUQ7kNvwHaCrkc&_nc_oc=AdmxZunDzCJz0UugAIqiy1-wZb83mYVOITiu9EJlUQ_r4FpDqTQkzsp6czFj3dkoCC8&_nc_zt=23&_nc_ht=scontent.fzyl2-2.fna&_nc_gid=MA3eijRlRJTLbL9TVesc3g&oh=00_AfEqggUqDiwC3x9whdguRrWQtyclxOc6vecHaNPYLL-S7A&oe=6807098D",
      message: "Track Mark is a lifesaver during exam season. All the materials are organized and easy to find!",
    },
    {
      name: "Nazmul Hossain",
      role: "Student",
      batch: "Batch 15",
      accentColor: "text-indigo-600",
      photo: "https://scontent.fzyl2-2.fna.fbcdn.net/v/t39.30808-6/469448901_1233443964435139_7270089946591654489_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGzEy8JOYImxYtxzYqIraKT2UrdMiWe3LXZSt0yJZ7ctbMvXifO63QJuTQowXSMdNivEAX3X36BeeO9LR0MHtiC&_nc_ohc=ye0DlNpuoxIQ7kNvwEMaWtA&_nc_oc=Adng3aG1YBVknkqkWJ0jpdhdLmRjliCn79miXwYohcSoq9PiZNtfuuyUg8k6GCSrsak&_nc_zt=23&_nc_ht=scontent.fzyl2-2.fna&_nc_gid=bherlzi4oLfi20z4MKDmqQ&oh=00_AfHegMscFRQtXzG2rh1MJ-p49yXkiIvFmvrnggY0o6gB4g&oe=68072E3C",
      message: "The upload feature is so fast! I love how I can contribute back to my juniors easily.",
    },
    {
      name: "Jilon Hossain Jilai",
      role: "Student",
      batch: "Batch 15",
      accentColor: "text-green-600",
      photo: "https://scontent.fzyl2-2.fna.fbcdn.net/v/t39.30808-6/481557347_2707230659476623_4990068707993636994_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeE_NhVEsjGbYRvH5tpweabESm9zS0ha19xKb3NLSFrX3FeBVvRHeJpc8jpI8WCkgKr-xKqKfp0AewuknpgzhmNC&_nc_ohc=bqKmU1ZeCU8Q7kNvwHhyksz&_nc_oc=AdnN1lNFjQO2xWDoVSY-JhOSvtK4gETKz39PkOGspkLwsJ-1pt8oBryyZFSutZ0Pi6I&_nc_zt=23&_nc_ht=scontent.fzyl2-2.fna&_nc_gid=H8PXUc1x8ZveKg4JP40mjQ&oh=00_AfGwkPVyiVMxKNeHd8ybCj41ca-PJ1oSZibLQzdDTV4x3g&oe=68071F55",
      message: "Really appreciate the effort behind this platform. Clean UI and very user-friendly!",
    },
    {
      name: "Nirob Hasan",
      role: "Student",
      batch: "Batch 15",
      accentColor: "text-pink-600",
      photo: "https://i.pravatar.cc/150?u=nirob",
      message: "I used this every week! Notes, slides, and even previous questions — everything in one place.",
    },
    {
      name: "Sazid Sheikh",
      role: "Student",
      batch: "Batch 15",
      accentColor: "text-yellow-600",
      photo: "https://scontent.fzyl2-2.fna.fbcdn.net/v/t39.30808-6/474535842_2253120421738907_2700274138998248249_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeE2SouCx7wcE5pEI47uaBIh1jEmoGxQnBrWMSagbFCcGnvEX7t4CxRX-LsThWWZyXMzU60w64vTdZVBt9DOT-wd&_nc_ohc=72hJ6fLeQKcQ7kNvwHgyRjJ&_nc_oc=AdkMOwLnReI_a7-odzDm15f2v8UzBNwzTbDiJ6O9XA3pLI4GObC5qQCObyAWLrgJRlI&_nc_zt=23&_nc_ht=scontent.fzyl2-2.fna&_nc_gid=b_4HUehmPOPWsmfarzdi4Q&oh=00_AfHUdz4uztFzCAoJayAiGrdYjf4M2bVP8o8mi_CRXdUGig&oe=68071E7E",
      message: "Excellent platform. The batch and semester filtering helps me find exactly what I need.",
    },
    {
      name: "Salem Hossain Siyam",
      role: "Student",
      batch: "Batch 15",
      accentColor: "text-red-600",
      photo: "https://scontent.fzyl2-2.fna.fbcdn.net/v/t39.30808-6/486955637_1851637452258117_2533985335111609425_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeEKYH3U3uBMyFjwevWYRJw37IC4kmknLhfsgLiSaScuF2zCoZuBe6QDX8mF31wBzSWGkYG9rrjb_Bp98HWdENK1&_nc_ohc=jmSr2lWYLVYQ7kNvwF8xw7Y&_nc_oc=Adm3hxOlRRLB_6F1wcFfD-xcwcIwq_Fot9yJN0MtEM5-xvVomd_9XE0dW7XD-En06c0&_nc_zt=23&_nc_ht=scontent.fzyl2-2.fna&_nc_gid=OeVSGbUv0ZTwR9gu3o0Mgw&oh=00_AfFdLlK2GTO8Qm-SNzLll9_tRUmNSciQZ1Ntu5IeZPu_tQ&oe=68071BC1",
      message: "Track Mark makes studying with friends collaborative and super convenient!",
    },
    {
      name: "Abdur Rahman Rupok",
      role: "Student",
      batch: "Batch 15",
      accentColor: "text-teal-600",
      photo: "https://scontent.fzyl2-2.fna.fbcdn.net/v/t39.30808-6/486370655_2471985619860429_4752771831794730161_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEj6OSb577IJEeYjKjzOQ9GE2RIWmR3d5cTZEhaZHd3lzotvgCDtjnY1SviD4FMu1lH96T7SoTERtYRhA_9iAge&_nc_ohc=QiJo0hT1ka8Q7kNvwHxCVib&_nc_oc=AdkBSEWohi18CXmct3RTz_FlYklaAUbU4I0CjpsFPSXMu1uxNA8ar0OhjA7jn-_7Eus&_nc_zt=23&_nc_ht=scontent.fzyl2-2.fna&_nc_gid=RY27uy1_-rdpECOkOpDKYA&oh=00_AfGCJs0z1XVVMX1FwD6V8N6OsifKhgyK1VqRmDGxfNJTsQ&oe=68071894",
      message: "Love the concept and execution. Hope it keeps growing!",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white mb-4">
          💬 What Students Say
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-10 text-base sm:text-lg">
          Real voices from our department — sharing their thoughts about Track Mark.
        </p>

        <Swiper
          slidesPerView={1}
          spaceBetween={24}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          loop={true}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Pagination, Navigation, Autoplay]}
          className="pb-12"
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index}>
              <TestimonialCard {...t} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonial;
