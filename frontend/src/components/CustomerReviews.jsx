import { FaStar } from "react-icons/fa";
import abhiAvatar from "../assets/reviews/abhi.jpg";
import anisulIslam from "../assets/illustrations/anisul-islam.jpg";

const reviews = [
  {
    name: "Saiful Alam",
    text: "The quality and speed of delivery were spot on. The product matches the description perfectly, and the support team was quick to answer my questions.",
    role: undefined,
    avatar: abhiAvatar,
  },
  {
    name: "Mohammad Anisul Islam",
    role: "Teacher & Motivational Speaker",
    avatar: anisulIslam,
    text: "I am truly impressed by the products on this website. The quality of the products is excellent, and the care and professionalism behind every detail are clearly visible. The founders of this platform are my students, and as a teacher, I feel extremely proud of their work. They have built a high-quality, trustworthy, and well-designed website. Seeing such effort and dedication truly makes me proud.",
  },
];

export default function CustomerReviews() {
  return (
    <section className="bg-[#0b0f1a] px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-indigo-300">
            Customer Voices
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            What Our Shoppers Say
          </h2>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            Real feedback from customers who trust us for quality, speed, and support.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-black/20 backdrop-blur"
            >
              <div className="flex items-center gap-4">
                <img
                  src={review.avatar}
                  alt={`${review.name} avatar`}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-500/60"
                />
                <div>
                  <p className="text-lg font-semibold text-white">{review.name}</p>
                  {review.role && (
                    <p className="text-sm text-slate-400">{review.role}</p>
                  )}
                  <div className="flex items-center gap-1 text-amber-400" aria-label="5 star rating">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <FaStar key={idx} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-base leading-relaxed text-slate-300">{review.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}