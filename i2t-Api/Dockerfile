# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY i2t-Api/*.csproj ./
RUN dotnet restore "i2t-Api.csproj"

COPY i2t-Api/. ./
RUN dotnet publish "i2t-Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install Tesseract + dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    libleptonica-dev \
    hunspell \
    hunspell-en-us \
    && rm -rf /var/lib/apt/lists/*

# Auto-detect installed liblept version and symlink to what Tesseract.NET expects
RUN LIBREAL=$(ls /usr/lib/x86_64-linux-gnu/lib*lept*.so* | head -n 1) \
    && ln -sf $LIBREAL /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so

# Export library path for .NET Tesseract
ENV LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH

# Copy app from build stage
COPY --from=build /app/publish .

# Copy tessdata models
COPY i2t-Api/tessdata /usr/share/tesseract-ocr/4.00/tessdata
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata

# Copy Hunspell dictionaries
COPY i2t-Api/Dictionaries /usr/share/hunspell

ENTRYPOINT ["dotnet", "i2t-Api.dll"]
