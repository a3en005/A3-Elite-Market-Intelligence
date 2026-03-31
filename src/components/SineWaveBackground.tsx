import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

const Spline = lazy(() => import('@splinetool/react-spline'));

const SineWaveBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden select-none">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="w-full h-full scale-110 lg:scale-100"
        style={{ filter: 'hue-rotate(140deg) brightness(0.8) contrast(1.2)' }}
      >
        <Suspense fallback={<div className="w-full h-full bg-bg" />}>
          <Spline 
            scene="https://prod.spline.design/ejcMmdsX2K57Kd-4/scene.splinecode"
            className="w-full h-full pointer-events-none"
          />
        </Suspense>
      </motion.div>
      
      {/* Subtle overlay to blend it better with the site's dark theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-transparent to-bg/80 pointer-events-none" />
    </div>
  );
};

export default SineWaveBackground;
