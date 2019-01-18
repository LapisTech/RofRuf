class Egg extends Page
{
	private itemmenu: Menu;

	protected init()
	{
		this.itemmenu = <Menu>this.querySelector( 'right-menu' );

		this.itemmenu.addEventListener( 'close', ( event ) =>
		{
			const item = this.selectedItem();
			// TODO: set view.
		} );

		(<Button>this.querySelector( 'bottom-button' )).addEventListener( 'click', ( event ) =>
		{
			event.stopPropagation();
			const item = this.selectedItem();

			this.hatch();
		} );

	}

	protected onShow()
	{
		this.showMenu();
	}
	protected onHide()
	{
		this.hideMenu();
	}

	private hatch()
	{
		const contents = document.createElement( 'div' );
		contents.classList.add( 'hatch' );

		const modal = this.app.popup();
		modal.enableOK( () => { this.onHatch(); return false; } );
		modal.clear();
		modal.appendChild( contents );
		modal.show();
	}

	private onHatch()
	{
		this.app.goTo( 'main' );
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
		return user.getItems().then( ( items ) =>
		{
			items.filter( ( item ) => { return item.type === ItemType.Item; } ).forEach( ( item ) =>
			{
				const mitem = new MenuItem();
				mitem.addEventListener( 'click', ( event ) => { this.selectItem( mitem ); } );
				this.itemmenu.appendChild( mitem );
			} );
		} );
	}
}
