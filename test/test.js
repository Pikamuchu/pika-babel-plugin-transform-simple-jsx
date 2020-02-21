/* eslint-env node, mocha */
import { assert } from 'chai';

describe('babel-plugin-transform-simple-jsx', () => {
  describe('Rendering tests', () => {
    it('function', () => {
      const body = greeting => (
        <div class="grid">
          <header>header</header>
          <article>{greeting}</article>
          <footer>footer</footer>
        </div>
      );

      const html = <html>{body('hello')}</html>;

      assert.equal(
        html,
        <html>
          <div class="grid">
            <header>header</header>
            <article>hello</article>
            <footer>footer</footer>
          </div>
        </html>
      );
    });

    it('inline function', () => {
      const html = (
        <html>
          {(function() {
            var greeting = 'hello';
            return <div>{greeting}</div>;
          })()}
        </html>
      );

      assert.equal(
        html.toString(),
        <html>
          <div>hello</div>
        </html>
      );
    });

    it('conditionals', () => {
      var sayBye = true;
      var showButton = true;
      const html = (
        <html>
          {sayBye ? <span>Bye</span> : <div>hello</div>}
          {showButton && <button type="button">Click Me!</button>}
        </html>
      );

      assert.equal(
        html,
        <html>
          <span>Bye</span>
          <button type="button">Click Me!</button>
        </html>
      );
    });

    it('map iterator', () => {
      var items = [
        { t: 'peas', p: 4, q: 6 },
        { t: 'carrot', p: 4, q: 6 },
        { t: 'chips', p: 4, q: 6 }
      ];
      var sales = (
        <sales vendor="John">
          {items.map(item => (
            <item type="{item.t}" price="{item.p}" quantity="{item.q}" />
          ))}
        </sales>
      );

      assert.equal(
        sales,
        <sales vendor="John">
          <item type="peas" price="4" quantity="6" />
          <item type="carrot" price="4" quantity="6" />
          <item type="chips" price="4" quantity="6" />
        </sales>
      );
    });
  });
});
