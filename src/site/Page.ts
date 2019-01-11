class Page extends HTMLElement
{
	protected app: App;
	constructor()
	{
		super();

		const shadow = this.attachShadow( { mode: 'open' } );

		const style = document.createElement( 'style' );
		style.innerHTML = this.initStyle( [
			':host { width: 100vmin; height: 100vmin; border-radius: 50%; margin: auto; top: 0; bottom: 0; left: 0; right: 0; position: absolute; overflow: hidden; }',
			':host( :not( [ show ] ) ) { visibility: hidden; }',
		] ).join( '' );

		const slot = document.createElement( 'slot' );

		shadow.appendChild( style );
		shadow.appendChild( slot );

		this.init();
	}

	protected init(){}

	protected initStyle( style: string[] ) { return style; }

	static get observedAttributes() { return [ 'show' ]; }

	public attributeChangedCallback( attrName: string, oldVal: any, newVal: any )
	{
		switch ( attrName )
		{
			case 'show': this.onChangeShow(); break;
		}
	}

	private onChangeShow()
	{
		if ( this.hasAttribute( 'show' ) )
		{
			this.onShow();
		} else
		{
			this.onHide();
		}
	}
	protected onShow(){}
	protected onHide(){}

	public setApp( app: App ) { this.app = app; }

	public show() { this.setAttribute( 'show', 'show' ); }//{ this.parent.classList.add( 'show' ); }
	public hide() { this.removeAttribute( 'show' ); }//{ this.parent.classList.remove( 'show' ); }

	public showMenu() { this.classList.add( 'on' ); }
	public hideMenu() { this.classList.remove( 'on' ); }
}
