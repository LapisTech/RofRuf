interface ModalClickCallback { (): boolean }

class Modal extends HTMLElement
{
	protected onCancel: undefined | ModalClickCallback;
	protected onOK: undefined | ModalClickCallback;
	protected cbutton: Button;
	protected obutton: Button;

	constructor()
	{
		super();

		const shadow = this.attachShadow( { mode: 'open' } );

		const style = document.createElement( 'style' );
		style.innerHTML = this.initStyle( [
			':host { display: block; visibility: hidden; position: absolute; margin: auto; top:0; bottom: 0; left: 0; right: 0; width: 100vmin; height: 100vmin; overflow: hidden; font-size: var( --fsize, 10vmin ); }',
			':host( [ show ] ) { visibility: visible; }',
			':host > div { transition: width 0.5s, height 0.5s; margin: auto; width: 0; height: 0; position: absolute; top: 0; bottom: 0; left: 0; right: 0; border-radius: 50%; overflow: hidden; background-color: rgba( 0, 0, 0, 0.6 ); }',
			':host( [ show ]:not( [ hide] ) ) > div { width: 100%; height: 100%; }',
			':host( [ hide ] ) > div { transition: width 0.5s ease 0.5s, height 0.5s ease 0.5s; }',
			':host > div > scroll-area { margin: auto; box-sizing: border-box; padding: 0; position: absolute; transition: height 0.5s ease 0.5s, padding 0.5s ease 0.5s; background-color: #57575f; display: flex; }',
		] ).join( '' );

		const wrapper = document.createElement( 'div' );
		wrapper.addEventListener( 'transitionend', ( event ) =>
		{
			event.stopPropagation();
			if ( !this.hasAttribute( 'hide' ) || event.propertyName !== 'width') { return; }
			this.removeAttribute( 'show' );
			this.removeAttribute( 'hide' );
		} );
		wrapper.addEventListener( 'click', ( event ) => { event.stopPropagation(); } );

		const contents = new Scroll();
		contents.addEventListener( 'transitionend', ( event ) =>
		{
			event.stopPropagation();
			if ( event.propertyName !== 'width' && event.propertyName !== 'height' ) { return; }
			if ( this.hasAttribute( 'hide' ) ) { return; }
			this.enableCancel( this.onCancel );
			this.enableOK( this.onOK );
		} );

		wrapper.appendChild( contents );

		const slot = document.createElement( 'slot' );
		contents.appendChild( slot );

		this.initContents( wrapper );

		this.cbutton.setAttribute( 'mode', 'cancel' );
		this.cbutton.addEventListener( 'click', () => { if ( !this.onCancel || !this.onCancel() ) { this.hide(); } } );
		wrapper.appendChild( this.cbutton );

		this.obutton.setAttribute( 'mode', 'ok' );
		this.obutton.addEventListener( 'click', () => { if ( !this.onOK || !this.onOK() ) { this.hide(); } } );
		wrapper.appendChild( this.obutton );

		shadow.appendChild( style );
		shadow.appendChild( wrapper );

		if ( this.tagName === 'DIALOG-WINDOW' )
		{
			contents.addEventListener( 'mousewheel', ( event: WheelEvent ) =>
			{
				if ( event.deltaX !== 0) { return; }
				event.stopPropagation();
				event.preventDefault();
				contents.scrollBy( event.deltaY, 0 );
			} );
		}
	}

	protected initStyle( style: string[] ) { return style; }

	protected initContents( wrapper: HTMLElement ){}

	public clear()
	{
		const c = this.children;
		for ( let i = c.length - 1 ; 0 <= i ; --i ) { this.removeChild( c[ i ] ); }
	}

	public show()
	{
		if ( !this.hasAttribute( 'show' ) )
		{
			this.setAttribute( 'show', 'show' );
			return;
		}
	}

	public hide()
	{
		if ( !this.hasAttribute( 'show' ) ) { return; }
		if ( this.hasAttribute( 'hide' ) ) { return; }

		this.setAttribute( 'hide', 'hide' );

		this.cbutton.classList.remove( 'on' );
		this.obutton.classList.remove( 'on' );
		this.clear();
		this.onCancel = this.onOK = undefined;
	}

	private updateShow( show: boolean )
	{
		if ( show ) { this.show(); } else { this.hide(); }
	}

	static get observedAttributes() { return [ 'show' ]; }

	public attributeChangedCallback( attrName: string, oldVal: any, newVal: any )
	{
		switch ( attrName )
		{
			case 'show': this.updateShow( this.hasAttribute( 'show' ) ); break;
		}
	}

	public enableCancel( callback?: ModalClickCallback ) { this.onCancel = callback; }

	public enableOK( callback?: ModalClickCallback ) { this.onOK = callback; }
}

class Popup extends Modal
{
	protected initStyle( style: string[] )
	{
		style.push(
			':host { z-index: var( --z-index, 2100000000 ) }',
			':host > div > scroll-area { width: 60%; height: 0; transition: height 0.5s ease 0.5s, padding 0.5s ease 0.5s; top: 0; left: 0; right: 0; }',
			':host( [ hide ] ) > div > scroll-area { transition: height 0.5s, padding 0.5s; text-align: center; }',
			':host( [ show ]:not( [ hide ] ) ) > div > scroll-area { height: 100%; padding: 5vmin 0; }'
		);
		return style;
	}

	protected initContents()
	{
		this.cbutton = new LeftButton();
		this.obutton = new RightButton();
	}

	public enableCancel( callback?: ModalClickCallback )
	{
		this.onCancel = callback;
		if ( this.hasAttribute( 'show' ) ) { this.cbutton.classList.add( 'on' ); }
	}

	public enableOK( callback?: ModalClickCallback )
	{
		this.onOK = callback;
		if ( this.hasAttribute( 'show' ) ) { this.obutton.classList[ callback ? 'add' : 'remove' ]( 'on' ); }
	}
}

class Dialog extends Modal
{
	protected initStyle( style: string[] )
	{
		style.push(
			':host { z-index: var( --z-index, 2100000050 ) }',
			':host > div > scroll-area { width: 0; height: 60%; transition: width 0.5s ease 0.5s, padding 0.5s ease 0.5s; top: 0; bottom: 0; left: 0; overflow-x: auto; }',
			':host( [ hide ] ) > div > scroll-area { transition: width 0.5s, padding 0.5s; }',
			':host( [ show ]:not( [ hide ] ) ) > div > scroll-area { width: 100%; padding: 0 5vmin; }',
		);
		return style;
	}

	protected initContents( wrapper: HTMLElement  )
	{
		this.cbutton = new TopButton();
		this.obutton = new BottomButton();
	}

	public enableCancel( callback?: ModalClickCallback )
	{
		this.onCancel = callback;
		if ( this.hasAttribute( 'show' ) ) { this.cbutton.classList[ callback ? 'add' : 'remove' ]( 'on' ); }
	}

	public enableOK( callback?: ModalClickCallback )
	{
		this.onOK = callback;
		if ( this.hasAttribute( 'show' ) ) { this.obutton.classList.add( 'on' ); }
	}
}

document.addEventListener( 'DOMContentLoaded', () =>
{
	customElements.define( 'popup-window', Popup );
	customElements.define( 'dialog-window', Dialog );
} );
