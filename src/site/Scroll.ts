
class Scroll extends HTMLElement
{
	constructor()
	{
		super();

		const shadow = this.attachShadow( { mode: 'open' } );

		const style = document.createElement( 'style' );

		style.innerHTML = this.initStyle( [
			':host { display: block; overflow: auto; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }',
			':host::-webkit-scrollbar { width: var( --scr-size, 1vmin ); height: var( --scr-size, 1vmin ); }',
			':host::-webkit-scrollbar-track { background: transparent;}',
			':host::-webkit-scrollbar-thumb { background: var( --scr-color, #afb1de ); }',
		] ).join( '' );

		const slot = document.createElement( 'slot' );

		shadow.appendChild( style );
		shadow.appendChild( slot );
	}

	protected initStyle( style: string[] ) { return style; }
}

document.addEventListener( 'DOMContentLoaded', () =>
{
	customElements.define( 'scroll-area', Scroll );
} );
