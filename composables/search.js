const sitePages = [
  { title: 'About Us', route: '/about' },
  { title: 'Contact Us', route: '/contact' },
  { title: 'FAQs', route: '/faqs' },
  { title: 'Basket', route: '/basket' },
  { title: 'Data Privacy', route: '/data-privacy', alias: "Privacy policy, policy" },
  { title: 'Cookies Policy', route: '/cookies-policy' },
  { title: 'Terms and Conditions', route: '/terms' },
  { title: 'Refund Policy', route: '/refund-policy' },
  { title: 'Book Paid Consultation', route: '/book-consultation' },
  { title: 'Manage Cookies Preferences', route: '/#footer' },
  // { title: '', route: '' },
]

export const useSearch = (services, query) => {
  let res = []

  // site pages
  const validSitePages = sitePages.filter((page) => {
    return page.title.toLowerCase().includes(query.toLowerCase()) || (page.alias && page.alias.toLowerCase().includes(query.toLowerCase()));
  });
  validSitePages.forEach((page) => {
    res.push(page);
  });

  // sort valid services
  const validServices = services.filter((service) => {
    return service.title.toLowerCase().includes(query.toLowerCase());
  });
  validServices.forEach((service) => {
    res.push({
      title: service.title,
      route: `/services/${service.slug}`,
    });
  });

  // sort subservices
  services.forEach((service) => {
    service.subservices.forEach((item) => {
      const condition = (item.title.toLowerCase().includes(query.toLowerCase()))
      if (condition) {
        res.push({
          title: item.title,
          route: `/services/${service.slug}/${item.slug}`,
          service: service.title
        })
      }
    });
  });

  // sort categories
  services.forEach((service) => {
    service.subservices.forEach((subservice) => {
      subservice.service_categories.forEach(
        (item) => {
          const condition = (item.title.toLowerCase().includes(query.toLowerCase()) || (item.country && item.country.toLowerCase().includes(query.toLowerCase())))
          if (condition) {
            res.push({
              title: item.title,
              country: item.country,
              route: `/services/${service.slug}/${subservice.slug}?country=${item.country}&title=${item.title}`,
              subservice: subservice.title,
            })
          }
        }
      )
    });
  });

  return res
}