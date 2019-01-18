class TextIcon extends HTMLElement
{
	constructor()
	{
		super();

		const shadow = this.attachShadow( { mode: 'open' } );

		const style = document.createElement( 'style' );
		style.innerHTML = [
			':host { font-family: Icon; }',
		].join( '' );

		shadow.appendChild( style );
		shadow.appendChild( document.createElement( 'slot' ) );
	}

}

document.addEventListener( 'DOMContentLoaded', () =>
{
	customElements.define( 'text-icon', TextIcon );
} );