import React from 'react';
import './Features.css';
import { Search, Award, Users, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

const Features = () => {
  const features = [
    { icon: <Search />, title: "Discover Events", desc: "Browse through hundreds of volunteering opportunities across various causes." },
    { icon: <Award />, title: "Earn Rewards", desc: "Collect points and badges for your contributions. Unlock achievements as you impact." },
    { icon: <Users />, title: "Build Community", desc: "Connect with like-minded individuals and organizations working towards change." },
    { icon: <ShieldCheck />, title: "Verified Certificates", desc: "Receive official certificates for your participation, great for portfolios." },
    { icon: <Zap />, title: "Smart Matching", desc: "Get personalized event suggestions based on your interests and availability." },
    { icon: <BarChart3 />, title: "Track Progress", desc: "Monitor your journey with detailed statistics and leaderboard rankings." }
  ];

  return (
    <section className="features-section">
      <div className="features-header">
        <h2>Everything You Need to <span>Make a Difference</span></h2>
        <p>Prayaas provides all the tools you need to find, participate in, and track your volunteering journey.</p>
      </div>
      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-item">
            <div className="f-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;