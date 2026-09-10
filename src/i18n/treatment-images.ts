// Single source of truth for each treatment's card/social-share image, so
// HomePage, TreatmentPage (related treatments) and BlogPost (og:image) all
// stay in sync instead of maintaining three separate copies of this map.
export const TREATMENT_IMAGES: Record<string, string> = {
  'all-on-4-5-6': '/images/all-on-4.jpg',
  'hollywood-smile': '/images/hollywood-smile.jpg',
  'emax-veneers': '/images/emax-veneers-smile.jpg',
  'monolithic-zirconia': '/images/monolithic-zirconia.jpg',
  'dental-implants': '/images/dental-implants.jpg',
  'zygomatic-implants': '/images/zygomatic-implants.png',
  'dental-bridge': '/images/dental-bridge.jpg',
  'invisalign': '/images/invisalign.png',
  'digital-smile-design': '/images/digital-smile-design.jpg',
  'teeth-whitening': '/images/teeth-whitening.jpg',
  'screw-retained-occlusal': '/images/screw-retained.jpg',
  'gingivectomy': '/images/gingivectomy.jpg',
  'sinus-lift': '/images/sinus-lift.jpg',
  'root-canal-therapy': '/images/root-canal.jpg',
  'full-denture': '/images/full-denture.webp',
  'orthodontics': '/images/orthodontics.jpg',
};
