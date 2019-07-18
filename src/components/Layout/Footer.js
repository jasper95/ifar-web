import React from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import Link from 'react-router-dom/Link';

import 'sass/components/footer/index.scss';


export default function Footer() {
  const informationMenu = [
    {
      name: 'About Us',
      link: '/#',
    },
    {
      name: 'Contact Us',
      link: '/#',
    },
    {
      name: 'Privacy Policy',
      link: '/#',
    },
    {
      name: 'Terms & Conditions',
      link: '/#',
    },
  ];

  const internMenu = [
    {
      name: 'Create Account',
      link: '/signup',
    },
    {
      name: 'FAQ',
      link: '/#',
    },
  ];


  const renderMenu = () => informationMenu.map(({ name, link }, index) => (
    <li key={index} className="footer_colItem_menu_item">
      <Link to={link}>
        <a>
          {name}
        </a>
      </Link>
    </li>
  ));

  const renderInterns = () => internMenu.map(({ name, link }, index) => (
    <li key={index} className="footer_colItem_menu_item">
      <Link to={link}>
        {name}
      </Link>
    </li>
  ));

  return (
    <footer className="footer">
      <div className="container">
        <Grid>
          <Cell
            className="footer_colItem-brand"
            size={3}
          >
            <Link to="/">
              <img
                src="/static/img/logo.png"
                alt=""
              />
            </Link>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque atque itaque doloremque in, accusamus voluptate assumenda voluptatem, obcaecati natus at!</p>
          </Cell>
          <Cell
            className="footer_colItem footer_colItem-information"
            size={3}
          >
            <h1 className="footer_colItem_header">Information</h1>
            <ul className="footer_colItem_menu">
              { renderMenu() }
            </ul>
          </Cell>
          <Cell
            className="footer_colItem footer_colItem-other"
            size={3}
          >
            <h1 className="footer_colItem_header">Interns</h1>
            <ul className="footer_colItem_menu">
              { renderInterns() }
            </ul>
          </Cell>
          <Cell
            className="footer_colItem footer_colItem-contact"
            size={3}
          >
            <h1 className="footer_colItem_header">Contact</h1>
            <div>
              <FontIcon>place</FontIcon>
              <div className="value">
                <p>Gorordo Avenue, Lahug, Cebu City</p>
                <p>Cebu, Philippines</p>
                <p>6000</p>
              </div>
            </div>
            <div>
              <FontIcon>local_phone</FontIcon>
              <div className="value">
                <p>+63 977-826-9012</p>
              </div>
            </div>
            <div>
              <FontIcon>email</FontIcon>
              <div className="value">
                <p>internlinksupport@gmail.com</p>
              </div>
            </div>
          </Cell>
        </Grid>
      </div>
    </footer>
  );
}
