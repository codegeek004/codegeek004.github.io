Plugin 'vim-plug'
 call plug#begin('~/.vim/plugged')

        Plug 'junegunn/seoul256.vim'
        Plug 'junegunn/vim-easy-align'
        Plug 'scrooloose/nerdtree', { 'on':  'NERDTreeToggle' }
        Plug 'tpope/vim-fireplace', { 'for': 'clojure' }
        " ...

        call plug#end()
