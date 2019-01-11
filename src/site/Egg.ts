class Egg extends Page
{
	private itemmenu: Menu;

	protected init()
	{
		this.itemmenu = <Menu>this.parent.querySelector( 'right-menu' );

		this.itemmenu.addEventListener( 'close', ( event ) =>
		{
			const item = this.selectedItem();
			// TODO: set view.
		} );

		(<Button>this.parent.querySelector( 'bottom-button' )).addEventListener( 'click', ( event ) =>
		{
			event.stopPropagation();
			const item = this.selectedItem();

			this.hatch();
		} );

	}

	private hatch()
	{
		const contents = document.createElement( 'div' );
		contents.classList.add( 'hatch' );

		const modal = this.app.popup();
		modal.clear();
		modal.appendChild( contents );
		modal.show();
	}

	private selectedItem()
	{
		const items = this.itemmenu.children;
		for ( let i = items.length - 1 ; 0 <= i ; --i )
		{
			if ( items[ i ].getAttribute( 'selected' ) ) { return <MenuItem>items[ i ]; }
		}
		return null;
	}

	public selectItem( item?: MenuItem )
	{
		const items = this.itemmenu.children;
		for ( let i = items.length - 1 ; 0 <= i ; --i )
		{
			if ( items[ i ] === item && !items[ i ].getAttribute( 'selected' ) )
			{
				items[ i ].setAttribute( 'selected', 'selected' );
			} else
			{
				items[ i ].removeAttribute( 'selected' );
			}
		}
	}

	public setUser( user: User )
	{
		user.getItems().filter( ( item ) => { return item.type === ItemType.Item; } ).forEach( ( item ) =>
		{
			const mitem = new MenuItem();
			mitem.addEventListener( 'click', ( event ) => { this.selectItem( mitem ); } );
			this.itemmenu.appendChild( mitem );
		} );

	}
}
