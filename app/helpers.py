'''
    Helper functions for added functionality in our views
'''
import re
import requests

def get_query(session):
    query_string = [F"{key}={session.get(key)}" for key in session.keys()]
    return '&'.join(query_string)

def update_state(params, session, keys):
    if params.get('reset'):
        session.clear()
    
    for key in keys:
        if params.get(key):
            session[key] = params.get(key)

def get_post_code(address):
    '''
        Returns the first match for a UK postal code from an address
    '''
    post_code_regex = "[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}"
    return re.findall(post_code_regex,address)

def get_lat_lon(address, session):
    '''
        Given the address of a location, returns it's lat,lon coordinates\n
        Saves the coordinates in session for future use
    '''
    post_code = get_post_code(address)
    search =  address if len(post_code)==0 else post_code[0]
    if(session.get(F'{search}-lat')==None or session.get(F'{search}-lon')==None):
        data = requests.get(F"https://nominatim.openstreetmap.org/search?q={search}&format=json").json()
        if(len(data) > 0):
            '''
                Store API requests in session to avoid searching places already found
            '''
            session[F'{search}-lat'] = data[0]["lat"]
            session[F'{search}-lon'] = data[0]["lon"]
    return (session.get(F'{search}-lat'), session.get(F'{search}-lon'))