class DB extends EventTarget
{
	private static VERSION = 1;
	private storage: Storage;
	private db: IDBDatabase;

	constructor()
	{
		super();
		this.storage = localStorage;
	}

	// Storage
	private getInteger( key: string, def = 0 )
	{
		const value = this.storage.getItem( key );
		if ( value === null ) { return def; }
		return parseInt( value );
	}

	private getDate( key: string )
	{
		const value = this.storage.getItem( key );
		if ( value === null ) { return new Date(); }
		return new Date( value );
	}

	// Ruf
	public getRuf()
	{
		const data: RufData =
		{
			type: this.getInteger( 'ruf_type' ),
			hp: this.getInteger( 'ruf_hp' ),
			birth: this.getDate( 'ruf_birth' ),
			dead: this.getDate( 'ruf_dead' ),
		};

		const ruf = new Ruf( data );

		if ( ruf.isDead() ) { return null; }

		return ruf;
	}

	// DB
	public reset( version?: number )
	{
		return new Promise( ( resolve, reject ) =>
		{
			this.db.close();
			const request = indexedDB.deleteDatabase( document.domain || 'rofruf.local' );
			request.onerror = ( event ) => { reject( event ); };
			request.onblocked = ( event ) => { reject( event ); };
			request.onsuccess = ( event ) => { resolve( event ); };
		} ).then( () => { return this.connect( version ); } );
	}

	public clear( storename: string )
	{
		return new Promise( ( resolve, reject ) =>
		{
			const store = this.db.transaction( [ storename ], 'readwrite' ).objectStore( storename );
			const request = store.clear();
			request.onerror = ( event ) => { reject( event ); };
			request.onsuccess = ( event ) => { resolve(); };
		} );
	}

	public connect( version?: number ): Promise<{}>
	{
		return new Promise( ( resolve, reject ) =>
		{
			const request = indexedDB.open( document.domain || 'rofruf.local', version );
			request.onblocked = ( event ) => { reject( event ); };
			request.onupgradeneeded = ( event ) =>
			{
				this.db = request.result;
				this.db.onerror = ( event ) => { reject( event ); };
				this.db.onabort = ( event ) => { reject( event ); };
				this.createObjectStore();
			};
			request.onsuccess = ( event ) =>
			{
				this.db = request.result;
console.log( 'onsuccess', event, this.db.version );
				if ( this.db.version !== DB.VERSION ) { this.db.close(); return reject( 'DB old.' ); }
				this.db.onerror = ( event ) => { this.dispatchEvent( event ); };
				this.db.onabort = ( event ) => { this.dispatchEvent( event ); };
				resolve({});
			};
			request.onerror = ( event ) => { console.log( 'onerror', event ); reject( event ); };
		} ).catch( ( error ) =>
		{
			if ( error !== 'DB old.' ) { throw error; }
			return this.connect( DB.VERSION );
		} );
	}

	private createObjectStore()
	{
console.log('PrevVer:',this.db.version);
		//if ( this.db.version === DB.VERSION ) { return; }

		for ( let i = this.db.version || 1 ; i <= DB.VERSION ; ++i )
		{
			const db = this.createVersionDB( i );
			db.convertFromPrev();
			db.createStores();
		}
	}

	private createVersionDB( version: number )
	{
		switch ( version )
		{
			case 1: return new DBv1( this.db );
		}
		return new DBvI( this.db );
	}

	// Items
	public getItems(): Promise<UserItem[]>
	{
		return new Promise( ( resolve, reject ) =>
		{
			const store = this.db.transaction( 'items', 'readonly' ).objectStore( 'items' );
			const request = store.getAll();
			request.onerror = ( event ) => { reject( event ); }
			request.onsuccess = ( event ) =>
			{
				resolve( request.result.filter( ( item: ItemStore ) => { return 0 < item.count; } ).map( ( item: ItemStore ) => { return { id: item.id, count: item.count }; } ) );
			};
		} );
	}

	public useItem( id: number ): Promise<UserItem>
	{
		return new Promise( ( resolve, reject ) =>
		{
			const store = this.db.transaction( 'items', 'readwrite' ).objectStore( 'items' );
			const request = store.get( 'id' );
			request.onerror = ( event ) => { reject( event ); };
			request.onsuccess = ( event ) =>
			{
				const data: ItemStore = { id: id, count: (<ItemStore>request.result).count - 1 };
				if ( data.count < 0 ) { return reject( new Error( 'Do not have item.' ) ); }
				const request2 = store.put( data );
				request2.onerror = ( event ) => { reject( event ); }
				request2.onsuccess = ( event ) =>
				{
					resolve( { id: data.id, count: data.count } );
				};
			};
		} );
	}

	public addItem( id: number, count = 1 ): Promise<UserItem>
	{
		return new Promise( ( resolve, reject ) =>
		{
			const store = this.db.transaction( 'items', 'readwrite' ).objectStore( 'items' );
			const request = store.get( id );
			request.onerror = ( event ) => { update( count ); };
			request.onsuccess = ( event ) => { const now = request.result ? (<ItemStore>request.result).count : 0 ; update( now + count ); };
			const update = ( count: number ) =>
			{
				const data: ItemStore = { id: id, count: count };
				const request = store.put( data );
				request.onerror = ( event ) => { reject( event ); }
				request.onsuccess = ( event ) =>
				{
					resolve( { id: data.id, count: data.count } );
				};
			};
		} );
	}
}

interface ItemStore
{
	id: number,    // unique
	count: number, //
}

class DBvI
{
	protected db: IDBDatabase;
	constructor( db: IDBDatabase ) { this.db = db; }

	public createStores(){}

	public convertFromPrev(){}

	protected createStore( name: string, keyPath: string, autoIncrement = false )
	{
console.log('createObjectStore',name,keyPath,autoIncrement);
		return this.db.createObjectStore( name, { keyPath: keyPath, autoIncrement: autoIncrement } );
	}
}

class DBv1 extends DBvI
{
	public createStores()
	{
		// ItemStore
		const items = this.createStore( 'items', 'id' );
	}
}
