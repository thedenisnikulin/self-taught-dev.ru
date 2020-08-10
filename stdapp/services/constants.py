URL = "https://api.hh.ru"
VACANCY_TAGS = {
    'type': {
        'fullstack': ['fullstack', 'full-stack', 'full stack'],
        'frontend': ['frontend', 'front-end', 'фронтенд'],
        'backend': ['backend', 'back-end'],
        'mobile': ['mobile', 'ios', 'android', 'react native', 'flutter', 'dart'],
        'junior': ['junior', 'джуниор', 'младший'],
    },
    'tech': {
        'python': ['python'],
        'java': ['java ', 'java/', 'java-', 'java,', 'java"'],  # those symbols at the end are important not to get JS jobs
        'javascript': ['javascript', 'js'],
        'c#': ['c#', 'с#', '.net'],     # some employers use cyrillic 'c', so double check
        'c++': ['c++', 'с++'],  # yet another 'c' double check
        'go': ['go', 'golang'],
        'php': ['php']
    }
}