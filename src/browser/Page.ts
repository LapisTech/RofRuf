class Page
{
	protected parent: HTMLElement;
	constructor( page: HTMLElement )
	{
		this.parent = page;
		this.init();
	}

	protected init(){}

	public hide() { this.parent.classList.remove( 'show' ); }
	public show() { this.parent.classList.add( 'show' ); }

	public hideMenu() { this.parent.classList.remove( 'on' ); }
	public showMenu() { this.parent.classList.add( 'on' ); }
}
