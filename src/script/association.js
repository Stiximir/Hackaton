document.addEventListener('DOMContentLoaded', function () {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
      header.addEventListener('click', function () {
          // Fermer tous les contenus d'accordéon
          const allContents = document.querySelectorAll('.accordion-content');
          allContents.forEach(content => {
              content.style.maxHeight = null;
              content.classList.remove('show');
          });

          // Ouvrir le contenu associé au header cliqué
          const content = this.nextElementSibling;
          if (content.style.maxHeight) {
              content.style.maxHeight = null;
          } else {
              content.style.maxHeight = content.scrollHeight + 'px';
              content.classList.add('show');
          }
      });
  });
});