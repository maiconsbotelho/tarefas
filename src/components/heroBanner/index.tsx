import Image from 'next/image';
import HeroImage from '../../../public/assets/hero.png';

// Componente para exibir o banner principal
const HeroBanner = () => {
  return (
    <div className="w-8/10 flex flex-col items-center justify-center">
      <Image
        className="sm:max-w-480 h-auto w-auto max-w-full object-contain"
        src={HeroImage}
        alt="Hero Banner"
        priority
      />
    </div>
  );
};

export default HeroBanner;
