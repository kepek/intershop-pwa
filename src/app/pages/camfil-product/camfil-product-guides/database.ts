// TODO: move to correct location
export interface PDPGuideImg {
  url: string;
  alt?: string;
}

export interface PDPGuide {
  img: PDPGuideImg;
  title: string;
  tagName: string;
  content: string;
  url: string;
  moreText?: string;
}

/** temporary data **/
export const GUIDES: PDPGuide[] = [
  {
    img: { url: 'https://material.angular.io/assets/img/examples/shiba2.jpg', alt: 'Img 1' },
    title: 'Title ',
    tagName: 'cat-name',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione odit doloribus numquam exercitationem beatae animi reprehenderit',
    url: 'https://www.camfil.com/en-gb',
    moreText: 'Read more',
  },
  {
    img: { url: 'https://material.angular.io/assets/img/examples/shiba2.jpg', alt: 'Img 2' },
    title: 'Title test 2 ',
    tagName: 'other one cat',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione odit doloribus numquam exercitationem beatae animi reprehenderit',
    url: 'https://www.camfil.com/en-gb',
  },
  {
    img: { url: 'https://material.angular.io/assets/img/examples/shiba2.jpg', alt: 'Img 3' },
    title: 'New Title last item',
    tagName: 'new-cat',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione odit doloribus numquam exercitationem beatae animi reprehenderit',
    url: 'https://www.camfil.com/en-gb',
  },
];
